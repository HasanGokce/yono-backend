export class User {
  id: number;
  username: string;
  socketId?: string;

  constructor(id: number, username: string, socketId?: string) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
  }
}
