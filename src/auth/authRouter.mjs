// Artem Zaitsev
import express from "express";
import {
  page,
  loginForm,
  registerForm,
  admin,
  usersTable,
  gamesList,
} from "../models.mjs";
const router = express.Router();
import path from "path";
import fs from "fs";
import userService from "./authService.mjs";
router.get("/login", (req, res) => {
  return res.json(page(userService.getUserStatus(req.session.id), loginForm));
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    const session = userService.sessions[req.session.id];
    if (!session?.user) {
      return res.status(401).json({ answer: "Unauthorized" });
    }
    return res.status(200).json({ answer: session.user });
  }

  const isAdmin = username === "admin" && password === "admin";
  if (isAdmin) {
    req.session.admin = true;
  }
  userService
    .login(username, password)
    .then((result) => {
      userService.sessions[req.session.id].user = result;
      return res.status(200).json({ answer: result });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(401).json({ error: err.message });
      } else {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
});

router.get("/register", (req, res) => {
  return res.json(
    page(userService.getUserStatus(req.session.id), registerForm),
  );
});

router.post("/register", (req, res) => {
  userService
    .create(req.body, req.session.id)
    .then(() => res.json({ answer: "OK" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.json({ error: err.message });
      } else {
        console.error(err);
        res.json({ error: "Internal server error" });
      }
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ answer: "Logged out" });
  });
});

router.get("/maxscore", (req, res) => {
  const session = userService.sessions[req.session.id];
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ score: session.maxScore, speed: session.maxSpeed });
});

router.post("/boat", (req, res) => {
  if (!req.body.boat) {
    return res.status(400).json({ error: "No boat provided" });
  }
  userService.updateSession(req.session.id, null, null, req.body.boat);
  return res.json({ answer: "OK" });
});

router.get("/boat", (req, res) => {
  const session = userService.sessions[req.session.id];
  if (!session) {
    return res.json({ boat: userService.updateSession(req.session.id).boat });
  } else {
    return res.json({ boat: session.boat });
  }
});

router.get("/admin", (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json(page(userService.getUserStatus(req.session.id), admin));
});

router.get("/users", (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const users = userService.getUsers();
  if (!users) {
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.json(usersTable(users));
});

router.delete("/users", (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "No username provided" });
  }
  userService.delete(username);
  return res.json({ answer: "OK" });
});

const usersFilePath = path.resolve(process.cwd(), "store", "users.csv");
if (!fs.existsSync(path.dirname(usersFilePath))) {
  fs.mkdirSync(path.dirname(usersFilePath));
}

router.post("/users/upload", async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }
  if (!userService.validateText(text)) {
    return res.status(400).json({ error: "Invalid text" });
  }

  fs.writeFileSync(usersFilePath, text);
  await userService.importFromCSV();
  return res.json({ answer: "OK" });
});

router.get("/users/download", (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!fs.existsSync(usersFilePath)) {
    return res.status(404).json({ error: "Nothing to export" });
  }

  res.download(usersFilePath, "users.csv", (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).json({ error: "File download failed" });
    }
  });
});

router.get("/sessions", (req, res) => {
  res.json(gamesList(userService.getGames()));
});
export default router;
