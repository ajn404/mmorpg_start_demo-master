import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
//@ts-ignore
import Crypt from "node-jsencrypt";
import { createHash } from "crypto";
import { PrivateKey } from "../common";

import mysql from "mysql";
import dayjs from "dayjs";

import { v4 as uuidv4 } from "uuid";

const cache = new Map();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "MMODB",
});
connection.connect();

const crypt = new Crypt();
crypt.setKey(PrivateKey);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get("/", function (req, res) {
  res.send("hello cocos");
});

// app.get("/reqister", function (req, res) {
//   res.send("reqister");
// });

app.post("/register", function (req, res) {
  let { account, password } = req.body;

  account = crypt.decrypt(account);
  password = crypt.decrypt(password);

  const hash = createHash("md5");
  hash.update(password);
  const passwordHex = hash.digest("hex");

  const sql = `insert into user (account, password, created_time) VALUES (?,?,?)`;

  connection.query(
    sql,
    [account, passwordHex, dayjs().format("YYYY-MM-DD HH:mm:ss")],
    (error, result, fields) => {
      if (error) {
        console.log(error);
        res.json({
          code: 500,
          msg: "注册失败",
        });
        return;
      }
      console.log(result);

      res.json({
        code: 200,
        msg: "注册成功",
      });
    }
  );
});

app.post("/login", function (req, res) {
  let { account, password } = req.body;

  account = crypt.decrypt(account);
  password = crypt.decrypt(password);

  //md5哈希散列算法
  //密码混淆存储
  const hash = createHash("md5");
  hash.update(password);
  const passwordHex = hash.digest("hex");

  const sql = `select * from user where account = ? and password = ?`;
  connection.query(sql, [account, passwordHex], (error, result, fields) => {
    if (error) {
      res.json({
        code: 500,
        msg: "登录失败",
      });
      console.log(error);

      return;
    }
    console.log(result);
    if (result.length > 0) {
      //登录成功，生成token存储在内存中
      const token = uuidv4();
      cache.set(token, account);
      console.log(cache);

      res.json({
        code: 200,
        msg: "登录成功",
        token: token,
        user: result[0],
      });
    }
  });
});

app.listen(3001);
console.log("server is running on 3001");
