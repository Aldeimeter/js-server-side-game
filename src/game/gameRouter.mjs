// Artem Zaitsev
import express from "express";
import { page, game, games } from "../models.mjs";
import { WebSocketServer } from "ws";
const router = express.Router();
import gameService from "./gameService.mjs";
import userService from "../auth/authService.mjs";

router.get("/game", (req, res) => {
  res.json(page(userService.getUserStatus(req.session.id), game));
});

router.get("/start", (req, res) => {
  const gameId = gameService.addGame();
  return res.json({ id: gameId });
});

router.post("/reset", (req, res) => {
  const { id } = req.body;
  gameService.removeGame(id);
  const gameId = gameService.addGame();
  return res.json({ id: gameId });
});

router.post("/stop", (req, res) => {
  const { id } = req.body;
  gameService.removeGame(id);
  userService.updateSession(req.session.id, null, null, null, null);
  return res.json({ answer: "Game stopped" });
});
router.post("/input", (req, res) => {
  const { id, key } = req.body;
  gameService.updateGame(id, key);

  return res.json({ answer: "Input received" });
});

router.get("/images", (_req, res) => {
  res.json(gameService.getImages());
});

router.get("/update", (req, res) => {
  const { id, watch } = req.query;
  const game = gameService.getGame(id);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }
  const info = game.getScore();
  if (!info) {
    return res.status(500).json({ error: "Internal server error" });
  }
  if (watch === "false") {
    userService.updateSession(req.session.id, info.score, info.speed, null, id);
  }
  return res.json(info);
});

router.get("/games", (req, res) => {
  res.json(page(userService.getUserStatus(req.session.id), games));
});

router.get("/watch", (req, res) => {
  res.json(page(userService.getUserStatus(req.session.id), game));
});
const wss = new WebSocketServer({ port: 8082 });

wss.on("connection", (ws) => {
  let gameId;
  let watchedGameId;
  // 3 VRATENIE iba aktualnej plochy hry zo serveru pomocou websocketov a vykreslenie aktualnej plochy cez canvas 1
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "start") {
      gameId = data.id;
      if (gameService.getGame(gameId)) {
        gameService.startGame(gameId, (state) => {
          ws.send(JSON.stringify(state));
        });
      }
    } else if (data.type === "reset") {
      if (gameService.getGame(gameId)) {
        gameService.removeGame(gameId);
      }
      gameId = data.id;
      if (gameService.getGame(gameId)) {
        gameService.startGame(gameId, (state) => {
          ws.send(JSON.stringify(state));
        });
      }
    } else if (data.type === "watch") {
      watchedGameId = data.id;
      if (gameService.getGame(watchedGameId)) {
        const watcher = {
          send: (state) => {
            ws.send(JSON.stringify(state));
          },
          close: () => {
            ws.close(1000, "Game stopped");
          },
        };
        gameService.watchGame(watchedGameId, watcher);
      }
    }
  });

  ws.on("close", () => {
    if (gameId) {
      gameService.removeGame(gameId);
    }
  });
});
export default router;
