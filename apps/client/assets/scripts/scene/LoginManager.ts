import { _decorator, Component, EditBox, Node } from "cc";
const { ccclass, property } = _decorator;

import Crypt from "jsencrypt";
import { PublicKey } from "../common";
const crypt = new Crypt();
crypt.setKey(PublicKey);

@ccclass("LoginManager")
export class LoginManager extends Component {
  account: EditBox;
  password: EditBox;
  onLoad() {
    this.account = this.node.getChildByName("Account").getComponent(EditBox);
    this.password = this.node.getChildByName("Password").getComponent(EditBox);
  }

  async register() {
    const password = crypt.encrypt(this.password.string);
    const account = crypt.encrypt(this.account.string);
    // 这里写登录逻辑
    console.log("account:", account, "password", password);
    const res = await fetch("http://localhost:3001/register", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        account,
        password,
      }),
    }).then((response) => response.json());
    console.log(res);
  }

  login() {
    const password = this.password.string;
    const account = this.account.string;
    // 这里写登录逻辑
    console.log(account, password);
  }
}
