import {Server, OPEN} from 'ws';

export default class SocketServer {
  _server: Server;
  constructor(port: number, path: string) {
    this._server = new Server({ port: port, path: path });
  }
  broadcast(data: any) {
    console.log(`BROADCASTING ${data}`);
    this._server.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
