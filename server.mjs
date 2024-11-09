// Artem Zaitsev
import express from "express";
import authRouter from "./src/auth/authRouter.mjs";
import gameRouter from "./src/game/gameRouter.mjs";
import session from "express-session";

const app = express();

const httpPort = 8080;

const maxAge = 60 * 60 * 1000;

app.use(
  session({
    secret: "VeronikaAcia",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: maxAge },
  }),
);

app.use(express.json());
app.use(express.static("src/public"));
app.use(authRouter);
app.use(gameRouter);

app.listen(httpPort, () => {
  console.log(`Listening on port ${httpPort}`);
});
