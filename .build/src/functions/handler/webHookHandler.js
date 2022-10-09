var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  sendWebhook: () => sendWebhook,
  webhookHandler: () => webhookHandler
});
var import_axios = __toModule(require("axios"));
var import__ = __toModule(require("../../index"));
let logqueue = [];
async function webhookHandler(log) {
  log.message = log.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "").replace(/,/g, " ");
  if (!log.event) {
    log["event"] = log.level;
  }
  if (log.event === "progressEnd" || log.message !== " ") {
    await webhooklogic(log);
  }
}
async function webhooklogic(log) {
  logqueue.push(log);
  if (logqueue.length > 1 && logqueue[logqueue.length - 1].event !== logqueue[logqueue.length - 2].event) {
    if (import__.userdata.settings.WebHookEvents.length > 0 && import__.userdata.settings.WebHookEvents.includes(logqueue[logqueue.length - 2].event.toLowerCase())) {
      await clearqueueandsend(log);
    } else if (import__.userdata.settings.WebHookEvents.length === 0) {
      await clearqueueandsend(log);
    } else {
      logqueue.splice(0, logqueue.length - 1);
    }
  }
}
async function clearqueueandsend(log) {
  let arraytosend = logqueue.splice(0, logqueue.length - 1);
  let stringarray = [];
  arraytosend.forEach((log2) => stringarray.push(log2.message));
  await sendWebhook(stringarray, arraytosend[0].event.toString(), import__.userdata.settings.WebHookURL, 8933352).then((status) => {
    if (!status) {
      throw "Error while trying to send the discord webhook";
    }
  });
  if (log.event === "progressEnd")
    logqueue = [];
}
async function sendWebhook(msg, event, webhookurl, color) {
  let content = "";
  let currentDrop = "";
  if (import__.userdata.startDrop !== void 0) {
    currentDrop = import__.userdata.startDrop === "" ? "none" : import__.userdata.startDrop.toString();
  } else {
    currentDrop = "none";
  }
  if (event === "progress") {
    let convertedProgress = await convertProgressString(msg);
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
  return await import_axios.default.post(webhookurl, JSON.stringify(embed), config).then(() => {
    return true;
  }).catch((e) => {
    return false;
  });
}
async function convertProgressString(stringarray) {
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendWebhook,
  webhookHandler
});
//# sourceMappingURL=webHookHandler.js.map
