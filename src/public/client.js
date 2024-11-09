// Artem Zaitsev

const cellSize = 12;
const xFields = 59;
const yFields = 59;
const mid = { x: (xFields - 1) / 2, y: (yFields - 1) / 2 };

const xShip = mid.x;
const yShip = mid.y;
let updateIval = null;
let updateGamesIval = null;
let debug = false;
let isLogged = false;
let watch = false;
let musicPlay = false;

const shipCenter = [
  [xShip - 1, yShip - 1],
  [xShip, yShip - 1],
  [xShip + 1, yShip - 1],
  [xShip - 1, yShip],
  [xShip, yShip],
  [xShip + 1, yShip],
  [xShip - 1, yShip + 1],
  [xShip, yShip + 1],
  [xShip + 1, yShip + 1],
];

const shipRotations = [
  { points: [3, 4, 5], rpg: 1 }, // 0 north
  { points: [0, 4, 8], rpg: 2 }, // 1 north-east
  { points: [1, 4, 7], rpg: 5 }, // 2 east
  { points: [2, 4, 6], rpg: 8 }, // 3 south-east
  { points: [3, 4, 5], rpg: 7 }, // 4 south
  { points: [0, 4, 8], rpg: 6 }, // 5 south-west
  { points: [1, 4, 7], rpg: 3 }, // 6 west
  { points: [2, 4, 6], rpg: 0 }, // 7 north-west
];

const renderElement = (element) => {
  const attrs = element.additionalAttrs
    ? element.additionalAttrs
        .map(({ attr, value }) => `${attr}="${value}"`)
        .join(" ")
    : "";

  if (element.tag === "br") return "<br />";
  return `<${element.tag}${attrs ? ` ${attrs}` : ""}>${element.innerText || ""}${
    element.innerTags?.map(renderElement).join("") || ""
  }</${element.tag}>`;
};

// Authentication

const isValidUsername = (username) => {
  return /^[a-zA-Z]+$/.test(username);
};

const isValidPassword = (password, passwordAgain) => {
  return password === passwordAgain;
};
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]{3,}@[^\s@]{3,}\.[^\s@]{2,4}$/;
  return emailPattern.test(email);
};
const checkLogin = () => {
  fetch("/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return { error: "Unauthorized" };
    })
    .then((data) => {
      if (data.error) {
        if (data.error !== "Unauthorized") {
          alert(data.error);
        }
        isLogged = false;
      } else {
        if (data.answer.username !== "N/A") {
          isLogged = true;
          window.location.hash = "/game";
        }
      }
    });
};

function register(ev) {
  ev.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const passwordAgain = document.getElementById("passwordAgain").value;

  if (!isValidEmail(email)) {
    alert("Invalid email");
    return;
  }

  if (!isValidUsername(username)) {
    alert("Invalid username");
    return;
  }
  if (!isValidPassword(password, passwordAgain)) {
    alert("Invalid password");
    return;
  }

  fetch("/register", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        checkLogin();
        window.location.hash = "/game";
      }
    })
    .catch((err) => console.error(err));
}

function login(ev) {
  ev.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!isValidUsername(username)) {
    alert("Invalid username");
    return;
  }

  fetch("/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        isLogged = false;
      } else {
        checkLogin();
        window.location.hash = "/game";
      }
    })
    .catch((err) => console.error(err));
}

function logout(ev) {
  ev.preventDefault();
  fetch("/logout", {
    method: "POST",
    credentials: "include",
  })
    .then(() => {
      isLogged = false;
      window.location.hash = "/login";
    })
    .catch((err) => console.error(err));
}

const renderPage = (url) => {
  fetch(url, {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      document.body.innerHTML = renderElement(data);
    })
    .catch((err) => console.error(err));
};

const loadUsers = () => {
  fetch("/users", {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      const root = document.getElementById("admin-table");
      root.innerHTML = data.map((user) => renderElement(user)).join("");
    })
    .catch((err) => console.error(err));
};

function deleteUser(username) {
  fetch("/users", {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      loadUsers();
    })
    .catch((err) => console.error(err));
}

function exportUsers() {
  fetch("/users/download", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to download file");
      }
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading the file:", error);
    });
}

function importUsers() {
  const fileInput = document.getElementById("file-input");
  fileInput.click();
}

function handleFileUpload(el) {
  const file = el.files[0];
  file.text().then((text) => {
    fetch("/users/upload", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        loadUsers();
      })
      .catch((err) => console.error(err))
      .finally(() => {
        el.value = "";
      });
  });
}

const loadGames = () => {
  fetch("/sessions", {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("games-list").innerHTML = data
        .map((game) => renderElement(game))
        .join("");
    })
    .catch((err) => console.error(err));
};

const checkHash = () => {
  let url = window.location.hash || "/game";
  if (url.startsWith("#")) url = url.substring(1);
  if (isLogged) {
    if (url === "/login" || url === "/register") {
      window.location.hash = "/game";
      return;
    }
  }
  renderPage(url);
  clearInterval(updateGamesIval);
  if (url === "/game") {
    stopWatch();
    loadMaxScore();
    startGame();
  } else if (url === "/watch") {
    if (!gameId) {
      window.location.hash = "/games";
    }
    return;
  } else {
    if (watch) {
      stopWatch();
    } else {
      stopGame();
    }
  }
  if (url === "/admin") {
    loadUsers();
  } else if (url === "/games") {
    loadGames();
    updateGamesIval = setInterval(loadGames, 3000);
  }
};

let gameId;
let socket;
let ctx;
const images = {};
let lastGameState = null;

function updateBoat(el) {
  let imgSrc = el.src;

  imgSrc = imgSrc.replace("png-64-thumb", "png-16-thumb");

  images.red.src = imgSrc;

  images.black.src = imgSrc;
  renderGame(lastGameState);
  fetch("/boat", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ boat: imgSrc }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
    })
    .catch((err) => console.error(err));
}

(async () => {
  fetch("/images")
    .then((res) => res.json())
    .then((data) => {
      Object.keys(data).forEach((key) => {
        images[key] = new Image();
        images[key].src = data[key];
      });
    });
  fetch("/boat", {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      images.red = new Image();
      images.black = new Image();
      images.black.src = data.boat;
      images.red.src = data.boat;
    })
    .catch((err) => console.error(err));
})();

const update = () => {
  fetch(`/update?id=${gameId}&watch=${watch}`, {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      const maxScore = document.getElementById("max-score");
      const maxSpeed = document.getElementById("max-speed");
      if (data.score > maxScore.innerText) {
        maxScore.innerText = data.score;
      }
      if (data.speed < maxSpeed.innerText) {
        maxSpeed.innerText = data.speed;
      }
      document.getElementById("score").innerText = data.score;
      document.getElementById("speed").innerText = data.speed;
      if (data.state === "Ended" && !watch) {
        stopGame();
      }
    })
    .catch((err) => console.error(err));
};

const startGame = async () => {
  window.addEventListener("keydown", checkKey);

  if (!gameId) {
    gameId = await fetch("/start", {
      method: "get",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data.id)
      .catch((err) => console.error(err));
  }
  if (!socket) {
    socket = new WebSocket("ws://localhost:8082");
    initListeners("start");
  }

  updateIval = setInterval(() => update(), 1000);
};

const initListeners = (type) => {
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: type, id: gameId }));
  });

  socket.addEventListener("message", (event) => {
    const gameProps = JSON.parse(event.data);
    lastGameState = gameProps;
    renderGame(gameProps);
  });

  if (type === "watch") {
    socket.addEventListener("close", (event) => {
      stopWatch();
      if (event.code === 1000) {
        window.location.hash = "/games";
        alert("Game Over!");
      }
    });
  }
};

const stopGame = () => {
  if (gameId) {
    fetch("/stop", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: gameId }),
    }).catch((err) => console.error(err));
    gameId = undefined;
  }
  if (socket) {
    socket.close();
    socket = undefined;
  }
  window.removeEventListener("keydown", checkKey);
  clearInterval(updateIval);
};

const resetGame = async () => {
  document.getElementById("reset-button").style.display = "none";
  setTimeout(() => {
    document.getElementById("reset-button").style.display = "block";
  }, 3000);

  if (gameId) {
    gameId = await fetch("/reset", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: gameId }),
    })
      .then((res) => res.json())
      .then((data) => data.id)
      .catch((err) => console.error(err));
    if (!socket) {
      socket = new WebSocket("ws://localhost:8082");
    }
    socket.send(JSON.stringify({ type: "reset", id: gameId }));
  } else {
    startGame("play");
  }
};

function watchGame(id) {
  gameId = id;
  watch = true;
  window.location.hash = "/watch";
  if (!socket) {
    socket = new WebSocket("ws://localhost:8082");
    initListeners("watch");
  }

  updateIval = setInterval(() => update(), 1000);
}

function stopWatch() {
  watch = false;
  gameId = undefined;
  if (socket) {
    socket.close();
    socket = undefined;
  }
  clearInterval(updateIval);
}

function toggleAudio(el) {
  const audio = el.previousElementSibling;
  if (musicPlay) {
    audio.pause();
  } else {
    audio.play();
  }
}
function toggleDebug() {
  debug = !debug;
}
const keys = ["KeyA", "KeyD", "ArrowRight", "ArrowLeft", "Space"];

const checkKey = (ev) => {
  ev.preventDefault();
  const key = ev.code;
  if (keys.includes(key)) {
    fetch("/input", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: gameId, key: key }),
    }).catch((err) => console.error(err));
  }
};

const loadMaxScore = () => {
  fetch("/maxscore", {
    method: "get",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      document.getElementById("max-score").innerText = data.score;
      document.getElementById("max-speed").innerText = data.speed;
    })
    .catch((err) => console.error(err));
};
checkHash();
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("hashchange", checkHash);
  checkLogin();
});

const renderGame = (gameProps) => {
  if (debug) {
    console.log("gameProps", gameProps);
    console.log("lastGameState", lastGameState);
    console.log("gameId", gameId);
    console.log("watch", watch);
  }
  const { rShip, missiles, lasers } = gameProps;
  const ctx = document.getElementById("game-canvas").getContext("2d");

  if (!ctx) return;
  ctx.clearRect(0, 0, xFields * cellSize, yFields * cellSize);

  missiles.forEach(({ x, y }) => displayPoint(ctx, x, y, "green"));
  lasers.forEach(({ x, y }) => displayPoint(ctx, x, y, "blue"));

  displayShip(ctx, rShip);
};

function displayPoint(ctx, x, y, color) {
  const image = images[color];
  if (image) {
    ctx.drawImage(image, x * cellSize, y * cellSize, cellSize, cellSize);
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
}

const displayShip = (ctx, rShip) => {
  shipRotations[rShip].points.forEach((point) => {
    const tmpX = shipCenter[point][0];
    const tmpY = shipCenter[point][1];
    displayPoint(ctx, tmpX, tmpY, "black");
  });
  const point = shipRotations[rShip].rpg;
  const tmpX = shipCenter[point][0];
  const tmpY = shipCenter[point][1];
  displayPoint(ctx, tmpX, tmpY, "red");
};
