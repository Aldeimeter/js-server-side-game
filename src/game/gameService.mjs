// Artem Zaitsev
import crypto from "crypto";
const uuidv4 = () => {
  return crypto.randomUUID();
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
class Game {
  constructor() {
    this.xFields = 59;
    this.yFields = 59;
    this.fields = 59;
    this.mid = {
      x: (this.xFields - 1) / 2,
      y: (this.yFields - 1) / 2,
    };
    this.xShip = this.mid.x;
    this.yShip = this.mid.y;
    this.missiles = [];
    this.rShip = 0;
    this.lasers = [];
    this.counter = 0;
    this.ival = null;
    this.speed = 1000;
    this.score = 0;
    this.previousState = null;
    this.updateCallback = null;
    this.state = "Created";
    this.watchers = [];
  }

  addMissile() {
    const rand = random(0, 7);
    // 7 0 1
    // 6   2
    // 5 4 3
    const mid = this.mid;
    const xFields = this.xFields;
    const yFields = this.yFields;

    if (rand === 0) this.missiles.push({ x: mid.x, y: 0 });
    else if (rand === 1) this.missiles.push({ x: xFields - 1, y: 0 });
    else if (rand === 2) this.missiles.push({ x: xFields - 1, y: mid.y });
    else if (rand === 3) this.missiles.push({ x: xFields - 1, y: yFields - 1 });
    else if (rand === 4) this.missiles.push({ x: mid.x, y: yFields - 1 });
    else if (rand === 5) this.missiles.push({ x: 0, y: yFields - 1 });
    else if (rand === 6) this.missiles.push({ x: 0, y: mid.y });
    else if (rand === 7) this.missiles.push({ x: 0, y: 0 });
  }

  rotateShip(rotation) {
    // calculate new ship points
    if (rotation > 0) this.rShip = (this.rShip + 1) % 8;
    else if (rotation < 0) {
      if (this.rShip === 0) this.rShip = 7;
      else this.rShip = this.rShip - 1;
    }

    // render new ship
    this.update();
  }

  moveMissiles() {
    // calculate new possitions
    this.missiles = this.missiles.map((missile) => {
      const mid = this.mid;
      //const m = (missile.y - mid.y) / (missile.x - mid.x);
      //const b = missile.y - m * missile.x;

      if (missile.x === mid.x) {
        if (missile.y > mid.y) return { x: missile.x, y: missile.y - 1 };
        else return { x: missile.x, y: missile.y + 1 };
      } else if (missile.y === mid.y) {
        if (missile.x < mid.x) return { x: missile.x + 1, y: missile.y };
        else return { x: missile.x - 1, y: missile.y };
      } else {
        let retX = missile.x;
        let retY = missile.y;
        if (missile.y < mid.y) retY++;
        else retY--;
        if (missile.x < mid.x) retX++;
        else retX--;
        return { x: retX, y: retY };
      }
    });

    if (this.collision()) {
      this.endGame();
    }

    // displayMissiles
    this.update();
  }

  collision() {
    const mid = this.mid;
    for (let i = 0; i < this.missiles.length; i++) {
      const missile = this.missiles[i];
      if (
        missile.x === mid.x + 1 ||
        missile.x === mid.x - 1 ||
        missile.y === mid.y + 1 ||
        missile.y === mid.y - 1
      ) {
        return true;
      }
    }
    return false;
  }

  addLaser() {
    // 7 0 1
    // 6   2
    // 5 4 3
    const mid = this.mid;
    const rShip = this.rShip;

    let retObj = { x: mid.x, y: mid.y, r: rShip };

    if (rShip === 0) {
      retObj.y = mid.y - 2;
    } else if (rShip === 1) {
      retObj.x = mid.x + 2;
      retObj.y = mid.y - 2;
    } else if (rShip === 2) {
      retObj.x = mid.x + 2;
    } else if (rShip === 3) {
      retObj.x = mid.x + 2;
      retObj.y = mid.y + 2;
    } else if (rShip === 4) {
      retObj.y = mid.y + 2;
    } else if (rShip === 5) {
      retObj.x = mid.x - 2;
      retObj.y = mid.y + 2;
    } else if (rShip === 6) {
      retObj.x = mid.x - 2;
    } else if (rShip === 7) {
      retObj.x = mid.x - 2;
      retObj.y = mid.y - 2;
    }

    this.lasers.push(retObj);
  }

  moveLasers() {
    // move lasers
    this.lasers = this.lasers.map((laser) => {
      if (laser.r === 0) {
        laser.y--;
      } else if (laser.r === 1) {
        laser.x++;
        laser.y--;
      } else if (laser.r === 2) {
        laser.x++;
      } else if (laser.r === 3) {
        laser.x++;
        laser.y++;
      } else if (laser.r === 4) {
        laser.y++;
      } else if (laser.r === 5) {
        laser.x--;
        laser.y++;
      } else if (laser.r === 6) {
        laser.x--;
      } else if (laser.r === 7) {
        laser.x--;
        laser.y--;
      }
      return laser;
    });

    this.lasers = this.lasers.filter((laser) => {
      if (laser.x < 0) return false;
      else if (laser.x > this.fields - 1) return false;
      else if (laser.y < 0) return false;
      else if (laser.y > this.fields - 1) return false;

      let laserXMissile = false;
      let removes = [];
      for (let i = 0; i < this.missiles.length; i++) {
        const missile = this.missiles[i];
        if (
          (missile.x === laser.x ||
            missile.x === laser.x + 1 ||
            missile.x === laser.x - 1) &&
          (missile.y === laser.y ||
            missile.y === laser.y + 1 ||
            missile.y === laser.y - 1)
        ) {
          laserXMissile = true;
          removes.push(i);
          break;
        }
      }

      if (removes.length > 0) {
        removes.forEach((remove) => {
          this.missiles.splice(remove, 1);
        });
      }

      return !laserXMissile;
    });
  }

  incrementScore(hm) {
    this.score = this.score + hm;
  }

  startGame(callback) {
    this.updateCallback = callback;
    this.score = 0;
    this.mainLoop();
    this.state = "Started";
  }

  mainLoop() {
    this.ival = setInterval(() => {
      this.moveMissiles();
      this.moveLasers();
      this.counter++;
      this.incrementScore(10);
      this.update();
      if (this.counter % 5 === 0) this.addMissile();
      if (this.counter % 20 === 0) {
        clearInterval(this.ival);
        this.speed = Math.round(this.speed / 2);
        this.mainLoop();
      }
    }, this.speed);
  }

  endGame() {
    clearInterval(this.ival);
    this.state = "Ended";
  }

  update(key = null) {
    if (key) {
      switch (key) {
        case "ArrowRight":
        case "KeyD":
          this.rotateShip(1);
          break;
        case "ArrowLeft":
        case "KeyA":
          this.rotateShip(-1);
          break;
        case "Space":
          this.addLaser();
          break;
        default:
          return;
      }
    }
    if (this.updateCallback) {
      const state = {
        rShip: this.rShip,
        missiles: this.missiles,
        lasers: this.lasers,
      };
      if (state === this.previousState) return;
      this.previousState = state;
      this.updateCallback(state);
      this.watchers.forEach((watcher) => watcher.send(state));
    }
  }

  getScore() {
    return {
      score: this.score,
      speed: this.speed,
      state: this.state,
    };
  }
  watch(watcher) {
    this.watchers.push(watcher);
  }
}

class GameService {
  constructor() {
    this.games = {};
  }

  addGame() {
    const id = uuidv4();
    this.games[id] = new Game();
    return id;
  }

  getGame(id) {
    return this.games[id];
  }

  getGames() {
    return this.games;
  }

  removeGame(id) {
    if (this.games[id]) {
      this.games[id].endGame();
      if (this.games[id].watchers.length) {
        this.games[id].watchers.forEach((watcher) => {
          watcher.close();
        });
      }
      delete this.games[id];
    }
  }

  startGame(id, callback) {
    if (this.games[id]) {
      this.games[id].startGame(callback);
    }
  }

  updateGame(id, key) {
    if (this.games[id]) {
      this.games[id].update(key);
    }
  }
  getImages() {
    return {
      green:
        "https://cdn.iconscout.com/icon/premium/png-16-thumb/asteroid-space-science-astronomy-astrology-planet-1-43714.png",
      blue: "https://cdn.iconscout.com/icon/premium/png-16-thumb/laser-10573670-9220061.png",
    };
  }
  watchGame(id, watcher) {
    if (this.games[id]) {
      this.games[id].watch(watcher);
    }
  }
}
const gameService = new GameService();

export default gameService;
