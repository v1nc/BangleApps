//copied from largeclock <3
(function(back) {
  const s = require("Storage");
  const apps = s
    .list(/\.info$/)
    .map(app => {
      var a = s.readJSON(app, 1);
      return (
        a && {
          n: a.name,
          t: a.type,
          src: a.src
        }
      );
    })
    .filter(app => app && (app.t == "app" || app.t == "clock" || !app.t))
    .map(a => {
      return { n: a.n, src: a.src };
    });
  apps.sort((a, b) => {
    if (a.n < b.n) return -1;
    if (a.n > b.n) return 1;
    return 0;
  });

  const settings = s.readJSON("terminalclock.json", 1) || {
    BTN1: "",
    BTN3: "",
    BGC : "",
    FGC : "",
    EC : "",
    SC : ""
  };

  function showApps(btn) {
    function format(v) {
      return v === settings[btn] ? "*" : "";
    }

    function onchange(v) {
      settings[btn] = v;
      s.writeJSON("terminalclock.json", settings);
    }

    const btnMenu = {
      "": {
        title: `Apps for ${btn}`
      },
      "< Back": () => E.showMenu(mainMenu)
    };

    if (apps.length > 0) {
      for (let i = 0; i < apps.length; i++) {
        btnMenu[apps[i].n] = {
          value: apps[i].src,
          format: format,
          onchange: onchange
        };
      }
    } else {
      btnMenu["...No Apps..."] = {
        value: undefined,
        format: () => "",
        onchange: () => {}
      };
    }
    return E.showMenu(btnMenu);
  }

  function showColors(color) {
    function format(v) {
      return v === settings[color] ? "*" : "";
    }

    function onchange(v) {
      settings[color] = v;
      s.writeJSON("terminalclock.json", settings);
    }

    const colorMenu = {
      "": {
        title: `Color for ${color}`
      },
      "Black": { value: "#000000", format: format, onchange: onchange },
      "White": { value: "#FFFFFF", format: format, onchange: onchange },
      "Eerie Black": { value: "#1f1f1f", format: format, onchange: onchange },
      "Wintergreen Dream": { value: "#679480", format: format, onchange: onchange },
      "Red": { value: "#991c1c", format: format, onchange: onchange },
      "Vegas Gold": { value: "#C0A35B", format: format, onchange: onchange },
      "< Back": () => E.showMenu(mainMenu)
    };
    return E.showMenu(colorMenu);
  }

  const mainMenu = {
    "": { title: "Terminal Clock Settings" },
    "< Back": back,
    "BTN1 app": () => showApps("BTN1"),
    "BTN3 app": () => showApps("BTN3"),
    "BG color" :  () => showColors("BGC"),
    "FG color " : () => showColors("FGC"),
    "ERR color" : () => showColors("EC"),
    "SUC color" : () => showColors("SC")
  };
  E.showMenu(mainMenu);
});
