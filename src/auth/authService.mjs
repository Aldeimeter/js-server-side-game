// Artem Zaitsev
import fs from "fs";
import path from "path";
import readline from "readline";
import events from "events";
import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex"); // Generate a 16-byte salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`; // Concatenate salt and hash with a separator
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(":"); // Split the stored hash into salt and hash
  const hashToVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return hashToVerify === originalHash; // Check if computed hash matches the stored hash
}

class User {
  constructor(username, email, password, maxScore = 0, maxSpeed = 1000) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.maxScore = maxScore;
    this.maxSpeed = maxSpeed;
    this.boat = 0;
  }
  toString() {
    return `${this.username},${this.email},${this.password},${this.maxScore},${this.maxSpeed}`;
  }

  static fromString(str) {
    const [username, email, password, maxScore, maxSpeed] = str.split(",");
    return new User(username, email, password, maxScore, maxSpeed);
  }
}

class UserService {
  constructor(users = []) {
    this.users = users;
    this.sessions = {};
    this.filename = path.resolve(process.cwd(), "store", "users.csv");
  }

  static async init() {
    const userService = new UserService();
    await userService.importFromCSV();
    return userService;
  }

  updateSession(sessionId, score = null, speed = null, boat = null, id) {
    const session = this.sessions[sessionId];

    if (session) {
      if (score !== null) {
        session.maxScore = Math.max(session.maxScore, score);
        session.score = score;
      }

      if (speed !== null) {
        session.maxSpeed = Math.min(session.maxSpeed, speed);
        session.speed = speed;
      }

      if (boat !== null) {
        session.boat = boat;
      }
      if (id !== undefined) {
        session.gameId = id;
      }
    } else {
      this.sessions[sessionId] = {
        maxScore: score !== null ? score : 0,
        maxSpeed: speed !== null ? speed : 1000,
        score: score !== null ? score : 0,
        speed: speed !== null ? speed : 1000,
        boat:
          boat ||
          "https://cdn.iconscout.com/icon/premium/png-16-thumb/plane-10784053-8828075.png",
        gameId: id || null,
        user: this.getUserStatus(sessionId),
      };
    }
    return this.sessions[sessionId];
  }

  async create(userData, sessionId) {
    const { username, email, password } = userData;
    const [isUsernameTaken, isEmailTaken] = this.find(username, email);

    if (isUsernameTaken || isEmailTaken) {
      const errors = [];
      if (isUsernameTaken) errors.push("Username is already taken");
      if (isEmailTaken) errors.push("Email is already taken");

      const e = new Error(errors.join(" and "));
      e.name = "ValidationError";
      throw e;
    }

    const session = this.sessions[sessionId];

    if (!session) {
      console.error(`Session ${sessionId} not found`);
    }

    const maxScore = session ? session.maxScore : 0;
    const maxSpeed = session ? session.maxSpeed : 1000;

    const user = new User(
      username,
      email,
      hashPassword(password),
      maxScore,
      maxSpeed,
    );
    this.users.push(user);
    await this.exportToCSV();

    this.sessions[sessionId] = session
      ? { ...session, user: { ...user, password: undefined } }
      : { maxScore, maxSpeed, score: 0, speed: 1000, user };

    return true;
  }

  find(username, email = null) {
    return [
      this.users.find((user) => user.username === username),
      this.users.find((user) => user.email === email),
    ];
  }

  async login(username, password) {
    const user = this.find(username)[0];

    if (!user) {
      const e = new Error("User not found");
      e.name = "ValidationError";
      throw e;
    }

    if (!verifyPassword(password, user.password)) {
      const e = new Error("Wrong password");
      e.name = "ValidationError";
      throw e;
    }
    const { password: _, maxScore: __, maxSpeed: ___, ...safeUser } = user;
    return safeUser;
  }

  async importFromCSV() {
    try {
      const users = [];
      const rl = readline.createInterface({
        input: fs.createReadStream(this.filename),
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        users.push(User.fromString(line));
      });

      await events.once(rl, "close");
      this.users = users;
      if (!this.users.find((user) => user.username === "admin")) {
        this.users.push(
          new User(
            "admin",
            "admin@admin.admin",
            hashPassword("admin"),
            0,
            1000,
          ),
        );
      }
      return users;
    } catch (error) {
      if (error.code === "ENOENT") {
        this.users = [];
        return [];
      }
      console.error("Failed to import users from CSV:", error);
      this.users = [];
      return [];
    }
  }

  async exportToCSV() {
    try {
      const dir = path.dirname(this.filename);
      await fs.promises.mkdir(dir, { recursive: true });

      const data = this.users
        .map((user) => user.toString())
        .join("\n")
        .concat("\n");

      await fs.promises.writeFile(this.filename, data);
      return true;
    } catch (error) {
      console.error("Failed to export users to CSV:", error);
      return null;
    }
  }

  getUserStatus(sessionId) {
    const session = this.sessions[sessionId];
    return session?.user || { username: "N/A", email: "N/A" };
  }

  getUsers() {
    return this.users.filter((user) => user.username !== "admin");
  }

  delete(username) {
    this.users = this.users.filter((user) => user.username !== username);
    this.exportToCSV();
  }
  validateText(text) {
    for (const line of text.split("\n")) {
      const errors = this.validateString(line);
      if (errors) {
        return errors;
      }
    }
    return null;
  }
  validateString(str) {
    const { username, email, password, maxScore, maxSpeed } = str.split(",");
    const errors = [];
    if (!/^[a-zA-Z]+$/.test(username))
      errors.push(`Invalid username ${username}`);
    if (!/^[^\s@]{3,}@[^\s@]{3,}\.[^\s@]{2,4}$/.test(email))
      errors.push(`Invalid email ${email}`);
    if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(password))
      errors.push(`Invalid password ${password}`);
    if (!/^\d+$/.test(maxScore)) errors.push(`Invalid maxScore ${maxScore}`);
    if (!/^\d+$/.test(maxSpeed)) errors.push(`Invalid maxSpeed ${maxSpeed}`);
    if (errors.length) {
      return errors.join(", ");
    }
    return null;
  }
  getGames() {
    return Object.values(this.sessions)
      .filter((session) => session.gameId)
      .map((session) => {
        return {
          username: session.user.username,
          gameProps: {
            gameId: session.gameId,
            boat: session.boat,
            maxScore: session.maxScore,
            maxSpeed: session.maxSpeed,
          },
        };
      });
  }
}
const userService = await UserService.init();
export default userService;
