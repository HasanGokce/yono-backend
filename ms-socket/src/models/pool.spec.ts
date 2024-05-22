import { Pool } from "./pool";
import { User } from "./user";

describe("Pool", () => {
  let pool: Pool;

  beforeEach(() => {
    pool = Pool.getInstance();
  });

  afterEach(() => {
    pool.users.clear();
  });

  it("should add a user to the pool", async () => {
    const user = new User(1, "JohnDoe");
    await pool.addUser(user);
    await pool.addUser(user);
    await pool.addUser(user);
    await pool.addUser(user);
    console.log(pool.users);
    expect(pool.users.has(user.id)).toBe(true);
  });

  it("should remove a user from the pool", async () => {
    const user = new User(1, "JohnDoe");
    pool.users.set(user.id, user);
    await pool.removeUser(user);
    expect(pool.users.has(user.id)).toBe(false);
  });

  it("should get all users in the pool", async () => {
    const user1 = new User(1, "JohnDoe");
    const user2 = new User(2, "Jane");
    const users = [user1, user2];
    for (const user of users) {
      pool.users.set(user.id, user);
    }
    const result = await pool.getUsers();
    expect(result).toEqual(pool.users);
  });

  it("should get a specific user from the pool", async () => {
    const user = new User(1, "JohnDoe");
    pool.users.set(user.id, user);
    const result = await pool.getUser(user);
    expect(result).toBe(user);
  });
});
