// Artem Zaitsev
const header = (user) => {
  const header = {
    tag: "header",
    innerTags: [
      {
        tag: "h1",
        innerText: "U2",
      },
      {
        tag: "a",
        additionalAttrs: [
          {
            attr: "href",
            value: "#/games",
          },
        ],
        innerText: "Games",
      },
      {
        tag: "br",
      },
      {
        tag: "a",
        additionalAttrs: [
          {
            attr: "href",
            value: "#/game",
          },
        ],
        innerText: "Game",
      },
    ],
  };
  if (user.username === "N/A") {
    header.innerTags.push(
      {
        tag: "br",
      },
      {
        tag: "a",
        additionalAttrs: [
          {
            attr: "href",
            value: "#/register",
          },
        ],
        innerText: "Sign up",
      },
      {
        tag: "br",
      },
      {
        tag: "a",
        additionalAttrs: [
          {
            attr: "href",
            value: "#/login",
          },
        ],
        innerText: "Sign in",
      },
    );
  } else {
    if (user.username == "admin") {
      header.innerTags.push(
        {
          tag: "br",
        },
        {
          tag: "a",
          additionalAttrs: [
            {
              attr: "href",
              value: "#/admin",
            },
          ],
          innerText: "Admin Panel",
        },
      );
    }
    header.innerTags.push(
      {
        tag: "h2",
        innerText: "",
        additionalAttrs: [
          {
            attr: "id",
            value: "username-header",
          },
        ],
        innerText: user.username,
      },
      {
        tag: "h2",
        innerText: "",
        additionalAttrs: [
          {
            attr: "id",
            value: "email-header",
          },
        ],
        innerText: user.email,
      },
      {
        tag: "button",
        additionalAttrs: [
          {
            attr: "type",
            value: "button",
          },
          {
            attr: "onclick",
            value: "logout(event)",
          },
        ],
        innerText: "Log out",
      },
    );
  }
  return header;
};

export const page = (user, component) => {
  return {
    tag: "div",
    id: "page",
    innerTags: [header(user), component()],
  };
};

export const loginForm = () => {
  return {
    tag: "form",
    additionalAttrs: [
      {
        attr: "action",
        value: "/login",
      },
      {
        attr: "method",
        value: "post",
      },
      {
        attr: "onsubmit",
        value: "login(event)",
      },
    ],
    innerTags: [
      {
        tag: "label",
        additionalAttrs: [
          {
            attr: "for",
            value: "username",
          },
        ],
        innerText: "Username",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "text",
          },
          {
            attr: "name",
            value: "username",
          },
          {
            attr: "id",
            value: "username",
          },
        ],
      },
      {
        tag: "label",
        additionalAttrs: [
          {
            attr: "for",
            value: "password",
          },
        ],
        innerText: "Password",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "password",
          },
          {
            attr: "name",
            value: "password",
          },
          {
            attr: "id",
            value: "password",
          },
        ],
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "submit",
          },
          {
            attr: "value",
            value: "submit",
          },
        ],
      },
    ],
  };
};

export const registerForm = () => {
  return {
    tag: "form",
    additionalAttrs: [
      {
        attr: "action",
        value: "/register",
      },
      {
        attr: "method",
        value: "post",
      },
      {
        attr: "onsubmit",
        value: "register(event)",
      },
    ],
    innerTags: [
      {
        tag: "label",
        additionalAttrs: [
          {
            attr: "for",
            value: "email",
          },
        ],
        innerText: "Email",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "email",
          },
          {
            attr: "name",
            value: "email",
          },
          {
            attr: "id",
            value: "email",
          },
        ],
      },
      {
        tag: "label",
        additionalAttrs: [
          {
            attr: "for",
            value: "username",
          },
        ],
        innerText: "Username",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "text",
          },
          {
            attr: "name",
            value: "username",
          },
          {
            attr: "id",
            value: "username",
          },
        ],
      },
      {
        tag: "label",
        additionalAttrs: [
          {
            attr: "for",
            value: "password",
          },
        ],
        innerText: "Password",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "password",
          },
          {
            attr: "name",
            value: "password",
          },
          {
            attr: "id",
            value: "password",
          },
        ],
      },
      {
        tag: "label",
        additionalAttrs: [
          {
            attr: "for",
            value: "password-again",
          },
        ],
        innerText: "Password again",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "password",
          },
          {
            attr: "name",
            value: "password-again",
          },
          {
            attr: "id",
            value: "passwordAgain",
          },
        ],
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "submit",
          },
          {
            attr: "value",
            value: "submit",
          },
        ],
      },
    ],
  };
};

const licences = [
  [
    {
      name: "Asteroid",
      href: "https://iconscout.com/icons/asteroid",
    },
    {
      name: "Nikita Golubev",
      href: "https://iconscout.com/contributors/lastspark",
    },
  ],
  [
    {
      name: "Laser",
      href: "https://iconscout.com/icons/laser",
    },
    {
      name: "Chessy K",
      href: "https://iconscout.com/contributors/cheessyk",
    },
  ],
  [
    {
      name: "Drone",
      href: "https://iconscout.com/icon/drone-2606894",
    },
    {
      name: "Pike Picture",
      href: "https://iconscout.com/contributors/pikepicture",
    },
  ],
  [
    {
      name: "Drone",
      href: "https://iconscout.com/icon/drone-2606882",
    },
    {
      name: "Pike Picture",
      href: "https://iconscout.com/contributors/pikepicture",
    },
  ],
  [
    {
      name: "Drone",
      href: "https://iconscout.com/icon/drone-2099271",
    },
    {
      name: "Koson Rattanaphan",
      href: "https://iconscout.com/contributors/Koson",
    },
  ],
  [
    {
      name: "Plane",
      href: "https://iconscout.com/icon/plane-10784053",
    },
    {
      name: "rgbryand",
      href: "https://iconscout.com/contributors/rgbryand",
    },
  ],
];
function transformLicence(licence) {
  const result = [];

  licence.forEach((item, index) => {
    result.push(
      {
        tag: "a",
        additionalAttrs: [
          { attr: "href", value: item.href },
          { attr: "target", value: "_blank" },
        ],
        innerText: item.name,
      },
      { tag: "span", innerText: index === 0 ? " by " : " on " },
    );
  });

  // Append the IconScout link and a <br> tag at the end
  result.push(
    {
      tag: "a",
      additionalAttrs: [
        { attr: "href", value: "https://iconscout.com/" },
        { attr: "target", value: "_blank" },
      ],
      innerText: "IconScout",
    },
    { tag: "br" },
  );

  return result;
}
export const game = () => {
  return {
    tag: "div",
    additionalAttrs: [
      {
        attr: "id",
        value: "game-container",
      },
    ],
    innerTags: [
      {
        tag: "canvas",
        additionalAttrs: [
          {
            attr: "id",
            value: "game-canvas",
          },
          {
            attr: "width",
            value: "708",
          },
          {
            attr: "height",
            value: "708",
          },
          {
            attr: "style",
            value: "border: 1px solid black; background: white;",
          },
        ],
      },
      {
        tag: "br",
      },
      {
        tag: "button",
        additionalAttrs: [
          {
            attr: "id",
            value: "reset-button",
          },
          {
            attr: "onclick",
            value: "resetGame()",
          },
          {
            attr: "type",
            value: "button",
          },
        ],
        innerText: "Reset",
      },
      {
        tag: "div",
        innerTags: [
          {
            tag: "p",
            innerText: "Max score:",
            innerTags: [
              {
                tag: "span",
                innerText: "0",
                additionalAttrs: [
                  {
                    attr: "id",
                    value: "max-score",
                  },
                ],
              },
            ],
          },
          {
            tag: "p",
            innerText: "Actual score:",
            innerTags: [
              {
                tag: "span",
                innerText: "0",
                additionalAttrs: [
                  {
                    attr: "id",
                    value: "score",
                  },
                ],
              },
            ],
          },
          {
            tag: "p",
            innerText: "Best speed:",
            innerTags: [
              {
                tag: "span",
                innerText: "1000",
                additionalAttrs: [
                  {
                    attr: "id",
                    value: "max-speed",
                  },
                ],
              },
            ],
          },
          {
            tag: "p",
            innerText: "Actual speed:",
            innerTags: [
              {
                tag: "span",
                innerText: "0",
                additionalAttrs: [
                  {
                    attr: "id",
                    value: "speed",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        tag: "div",
        innerTags: [
          {
            tag: "img",
            additionalAttrs: [
              {
                attr: "src",
                value:
                  "https://cdn.iconscout.com/icon/premium/png-64-thumb/drone-2606894-2177601.png",
              },
              {
                attr: "onclick",
                value: "updateBoat(this)",
              },
            ],
          },
          {
            tag: "img",
            additionalAttrs: [
              {
                attr: "src",
                value:
                  "https://cdn.iconscout.com/icon/premium/png-64-thumb/drone-2606882-2177589.png",
              },
              {
                attr: "onclick",
                value: "updateBoat(this)",
              },
            ],
          },
          {
            tag: "img",
            additionalAttrs: [
              {
                attr: "src",
                value:
                  "https://cdn.iconscout.com/icon/premium/png-64-thumb/drone-2099271-1766914.png",
              },
              {
                attr: "onclick",
                value: "updateBoat(this)",
              },
            ],
          },
          {
            tag: "img",
            additionalAttrs: [
              {
                attr: "src",
                value:
                  "https://cdn.iconscout.com/icon/premium/png-64-thumb/plane-10784053-8828075.png",
              },
              {
                attr: "onclick",
                value: "updateBoat(this)",
              },
            ],
          },
        ],
      },
      {
        tag: "br",
      },
      {
        tag: "div",
        innerTags: [
          ...licences.flatMap((licence) => transformLicence(licence)),
          {
            tag: "a",
            additionalAttrs: [
              {
                attr: "href",
                value: "https://iconscout.com/licenses#iconscout",
              },
              { attr: "target", value: "_blank" },
            ],
            innerText: "IconScout Licence",
          },
          {
            tag: "br",
          },
          {
            tag: "a",
            additionalAttrs: [
              {
                attr: "href",
                value: "https://opengameart.org/content/deep-space-flight",
              },
              { attr: "target", value: "_blank" },
            ],
            innerText: "Deep Space Flight",
          },
          {
            tag: "span",
            innerText: " by ",
          },
          {
            tag: "a",
            additionalAttrs: [
              {
                attr: "href",
                value: "https://opengameart.org/users/remaxim",
              },
              { attr: "target", value: "_blank" },
            ],
            innerText: "Remaxim",
          },
          {
            tag: "span",
            innerText: " on ",
          },
          {
            tag: "a",
            additionalAttrs: [
              {
                attr: "href",
                value: "https://opengameart.org/",
              },
              { attr: "target", value: "_blank" },
            ],
            innerText: "OpenGameArt",
          },
          {
            tag: "a",
            additionalAttrs: [
              {
                attr: "href",
                value: "https://creativecommons.org/licenses/by-sa/3.0/",
              },
              { attr: "target", value: "_blank" },
            ],
            innerText: "CC-BY-SA 3.0",
          },
        ],
      },
      {
        tag: "div",
        innerTags: [
          {
            tag: "audio",
            additionalAttrs: [
              {
                attr: "src",
                value:
                  "https://opengameart.org/sites/default/files/deep%20space%20flight.ogg",
              },
              {
                attr: "volume",
                value: "0.01",
              },
            ],
          },
          {
            tag: "button",
            additionalAttrs: [
              {
                attr: "onclick",
                value: "toggleAudio(this)",
              },
            ],
            innerText: "Toggle Audio",
          },
        ],
        innerText: "Deep Space Flight Music",
      },
      {
        tag: "br",
      },
      {
        tag: "button",
        additionalAttrs: [
          {
            attr: "onclick",
            value: "toggleDebug()",
          },
        ],
        innerText: "Toggle Debug",
      },
    ],
  };
};

export const admin = () => {
  return {
    tag: "div",
    innerTags: [
      {
        tag: "h1",
        innerText: "Admin Panel",
      },
      {
        tag: "br",
      },
      {
        tag: "button",
        additionalAttrs: [
          {
            attr: "onclick",
            value: "importUsers()",
          },
        ],
        innerText: "Import",
      },
      {
        tag: "input",
        additionalAttrs: [
          {
            attr: "type",
            value: "file",
          },
          {
            attr: "id",
            value: "file-input",
          },
          {
            attr: "accept",
            value: "text/csv",
          },
          {
            attr: "style",
            value: "display: none;",
          },
          {
            attr: "onchange",
            value: "handleFileUpload(this)",
          },
        ],
      },
      {
        tag: "button",
        additionalAttrs: [
          {
            attr: "onclick",
            value: "exportUsers()",
          },
        ],
        innerText: "Export",
      },
      {
        tag: "br",
      },
      {
        tag: "span",
        innerText: "Click on row to delete it.",
      },
      {
        tag: "br",
      },
      {
        tag: "table",
        additionalAttrs: [
          {
            attr: "id",
            value: "admin-table",
          },
        ],
        innerTags: [],
      },
    ],
  };
};

export const usersTable = (users) => {
  const rows = users.map((user) => {
    return {
      tag: "tr",
      innerTags: [
        {
          tag: "td",
          innerText: user.username,
        },
        {
          tag: "td",
          innerText: user.email,
        },
        {
          tag: "td",
          innerText: user.password,
        },
        {
          tag: "td",
          innerText: user.maxScore,
        },
        {
          tag: "td",
          innerText: user.maxSpeed,
        },
      ],
      additionalAttrs: [
        {
          attr: "onclick",
          value: `deleteUser('${user.username}')`,
        },
      ],
    };
  });
  rows.unshift({
    tag: "tr",
    innerTags: [
      {
        tag: "th",
        innerText: "Username",
      },
      {
        tag: "th",
        innerText: "Email",
      },
      {
        tag: "th",
        innerText: "Password",
      },
      {
        tag: "th",
        innerText: "Max score",
      },
      {
        tag: "th",
        innerText: "Best speed",
      },
    ],
  });
  return rows;
};

export const games = () => {
  return {
    tag: "div",
    innerTags: [
      {
        tag: "h1",
        innerText: "Games",
      },
      {
        tag: "br",
      },
      {
        tag: "ul",
        additionalAttrs: [
          {
            attr: "id",
            value: "games-list",
          },
        ],
      },
    ],
  };
};

export const gamesList = (games) => {
  {
    const rows = games.map((game) => {
      return {
        tag: "li",
        innerText: `Name: ${game.username} - Max Score: ${game.gameProps.maxScore} - Best Speed: ${game.gameProps.maxSpeed}`,
        additionalAttrs: [
          {
            attr: "onclick",
            value: `watchGame('${game.gameProps.gameId}')`,
          },
        ],
      };
    });
    return rows;
  }
};
