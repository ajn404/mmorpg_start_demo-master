import { RpcFunc } from "../common";
import { Singleton } from "../common/common/base";
import { WebSocketServer, type WebSocket } from "ws";

export class GatewayManager extends Singleton {
  static get Instance() {
    return super.GetInstance<GatewayManager>();
  }

  //实现一个websocket服务
  init() {
    console.log("gateway 服务");
    const wss = new WebSocketServer({ port: 4000 });

    wss.on("connection", (ws: WebSocket) => {
      ws.on("error", console.error);

      ws.on("message", (buffer: Buffer) => {
        this.handleMessage(ws, buffer);
      });

      //   ws.send("something");
    });
  }

  handleMessage(ws: WebSocket, buffer: Buffer) {
    console.log("received: %s", buffer.toString());
    const { name, data } = JSON.parse(buffer.toString());
    if (name === RpcFunc.enterGame) {
      //   todo:鉴权
    } else {
      // 与game服务器通信
    }
    ws.send(buffer.toString());
  }
}
