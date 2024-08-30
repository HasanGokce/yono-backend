export class User {
  id: string;
  username: string;
  socketId?: string;

  constructor(id: string, username: string, socketId?: string) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
  }
}
