import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
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

  res.json({});
});

app.listen(3001);
console.log("server is running on 3001");
