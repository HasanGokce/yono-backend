import { User } from "./user";

export class Pool {
  private static instance: Pool;
  public users = new Map<string, User>();

  private constructor() {
    // init
  }

  public static getInstance() {
    if (!Pool.instance) {
      Pool.instance = new Pool();
    }
    return Pool.instance;
  }

  public async query(query: string) {
    // query
  }

  public async addUser(user: User): Promise<User[]> {
    console.log(this.users);
    if (this.users.size > 0) {
      const existingUser = this.users.values().next().value;
      return this.matchUsers(existingUser, user);
    } else {
      this.users.set(user.id, user);
      return [user];
    }
  }

  public matchUsers(user1: User, user2: User): User[] {
    // Eşleşme işlemleri burada yapılabilir
    this.users.delete(user1.id);
    this.users.delete(user2.id);
    return [user1, user2];
  }

  public async removeUser(user: User) {
    this.users.delete(user.id);
  }

  public async getUsers() {
    return this.users;
  }

  public async getUser(user: User) {
    return this.users.get(user.id);
  }
}
