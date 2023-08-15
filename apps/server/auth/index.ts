import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
//@ts-ignore
import Crypt from "node-jsencrypt";
import { PrivateKey } from "../common";

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
  console.log(req.body);
  let { accound, password } = req.body;
  accound = crypt.decrypt(accound);
  password = crypt.decrypt(password);
  console.log(accound, password);

  res.json({});
});

app.listen(3001);
console.log("server is running on 3001");
