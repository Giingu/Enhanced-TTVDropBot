"use strict";
var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebhook = exports.webhookHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../../index");
let logqueue = [];
function webhookHandler(log) {
  return __awaiter(this, void 0, void 0, function* () {
    log.message = log.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "").replace(/,/g, " ");
    if (!log.event) {
      log["event"] = log.level;
    }
    if (log.event === "progressEnd" || log.message !== " ") {
      yield webhooklogic(log);
    }
  });
}
exports.webhookHandler = webhookHandler;
function webhooklogic(log) {
  return __awaiter(this, void 0, void 0, function* () {
    logqueue.push(log);
    if (logqueue.length > 1 && logqueue[logqueue.length - 1].event !== logqueue[logqueue.length - 2].event) {
      if (index_1.userdata.settings.WebHookEvents.length > 0 && index_1.userdata.settings.WebHookEvents.includes(logqueue[logqueue.length - 2].event.toLowerCase())) {
        yield clearqueueandsend(log);
      } else if (index_1.userdata.settings.WebHookEvents.length === 0) {
        yield clearqueueandsend(log);
      } else {
        logqueue.splice(0, logqueue.length - 1);
      }
    }
  });
}
function clearqueueandsend(log) {
  return __awaiter(this, void 0, void 0, function* () {
    let arraytosend = logqueue.splice(0, logqueue.length - 1);
    let stringarray = [];
    arraytosend.forEach((log2) => stringarray.push(log2.message));
    yield sendWebhook(stringarray, arraytosend[0].event.toString(), index_1.userdata.settings.WebHookURL, 8933352).then((status) => {
      if (!status) {
        throw "Error while trying to send the discord webhook";
      }
    });
    if (log.event === "progressEnd")
      logqueue = [];
  });
}
function sendWebhook(msg, event, webhookurl, color) {
  return __awaiter(this, void 0, void 0, function* () {
    let content = "";
    let currentDrop = "";
    if (index_1.userdata.startDrop !== void 0) {
      currentDrop = index_1.userdata.startDrop === "" ? "none" : index_1.userdata.startDrop.toString();
    } else {
      currentDrop = "none";
    }
    if (event === "progress") {
      let convertedProgress = yield convertProgressString(msg);
      content = convertedProgress.toString().split(",").join("\n");
    } else {
      content = msg.toString().split(",").join("\n\n");
    }
    let config = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
        "Content-type": "application/json"
      }
    };
    let embed = {
      username: "TTVDropBot",
      avatar_url: "https://i.imgur.com/2WtgNe4.png",
      embeds: [
        {
          "author": {
            "name": "TTVDropBot\u{1F4DC}",
            "url": "https://github.com/PockySweet/TTVDropBot-Fix",
            "icon_url": "https://i.imgur.com/2WtgNe4.png"
          },
          "fields": [
            {
              "name": "Event",
              "value": event,
              "inline": true
            },
            {
              "name": "Current Drop",
              "value": currentDrop,
              "inline": true
            }
          ],
          "color": color,
          "description": "```" + content + "```",
          "footer": {
            "text": "Send directly from TTVDropbot made by Zarg!"
          },
          "timestamp": new Date()
        }
      ]
    };
    return yield axios_1.default.post(webhookurl, JSON.stringify(embed), config).then(() => {
      return true;
    }).catch((e) => {
      return false;
    });
  });
}
exports.sendWebhook = sendWebhook;
function convertProgressString(stringarray) {
  return __awaiter(this, void 0, void 0, function* () {
    let finallog = [];
    stringarray.forEach((log) => {
      let splitted = log.split(" | ");
      let firsttwo = splitted.slice(0, 2);
      let rest = splitted.slice(2, splitted.length);
      if (rest.length === 0) {
        finallog.push(firsttwo.toString().replace(/,/g, " | ") + "\n");
      } else {
        if (firsttwo.length > 0)
          finallog.push(firsttwo.toString().replace(/,/g, " | "));
        if (rest.length > 0)
          finallog.push(rest.toString().replace(/,/g, " | ") + "\n");
      }
    });
    return finallog;
  });
}
//# sourceMappingURL=webHookHandler.js.map
