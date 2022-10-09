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
  WatchingEventHandlerStart: () => WatchingEventHandlerStart,
  WatchingEventHandlerStop: () => WatchingEventHandlerStop,
  sendMinuteWatched: () => sendMinuteWatched
});
var import_getTwitchDrops = __toModule(require("../get/getTwitchDrops"));
var import__ = __toModule(require("../../index"));
var import_liveCheck = __toModule(require("../../Checks/liveCheck"));
var import_winston = __toModule(require("winston"));
var import_getCurrentDrop = __toModule(require("../get/getCurrentDrop"));
var import_util = __toModule(require("../../utils/util"));
var import_dateCheck = __toModule(require("../../Checks/dateCheck"));
var import_axios = __toModule(require("axios"));
var import_claimCheck = __toModule(require("../../Checks/claimCheck"));
var import_chalk = __toModule(require("chalk"));
var import_samepercentCheck = __toModule(require("../../Checks/samepercentCheck"));
var import_pointsCheck = __toModule(require("../../Checks/pointsCheck"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init(import__.userdata.clientid);
const { Base64 } = require("js-base64");
let status = "stopped";
async function WatchingEventHandlerStart(DropcurrentlyWatching) {
  if (status === "stopped") {
    await (0, import_getTwitchDrops.getTwitchDrops)(import__.userdata.game, false);
    await (0, import_liveCheck.allOfflineCheck)();
    await (0, import_liveCheck.liveCheck)(DropcurrentlyWatching, false);
    await sendMinuteWatched(DropcurrentlyWatching.toString().toLowerCase());
    status = "running";
    await loop(DropcurrentlyWatching);
  } else if (status === "running") {
    await loop(DropcurrentlyWatching);
  }
}
async function loop(DropcurrentlyWatching) {
  await (0, import_util.delay)(import__.userdata.settings.ProgressCheckInterval);
  if (import__.userdata.settings.debug)
    import_winston.default.info("UserDATA %o", JSON.stringify(import__.userdata, null, 2));
  await (0, import_getTwitchDrops.getTwitchDrops)(import__.userdata.game, false);
  await (0, import_liveCheck.allOfflineCheck)();
  if (status === "running") {
    await (0, import_getCurrentDrop.getCurrentDrop)().then(async (CurrentDrop) => {
      if (import__.userdata.settings.debug)
        import_winston.default.info("CurrentDrop %o", JSON.stringify(CurrentDrop, null, 2));
      if (!CurrentDrop.foundlivech.includes(DropcurrentlyWatching) && CurrentDrop.foundlivech.length > 0) {
        DropcurrentlyWatching = CurrentDrop.foundlivech[0];
        import_winston.default.info(import_chalk.default.gray("Switched current Channel to " + import_chalk.default.white(DropcurrentlyWatching) + "..."));
        import_winston.default.silly(" ");
      }
      await (0, import_liveCheck.liveCheck)(DropcurrentlyWatching, false);
      await (0, import_claimCheck.claimableCheck)(CurrentDrop, import__.userdata.settings.AutoClaim, false);
      await (0, import_dateCheck.dateCheck)(CurrentDrop, false);
      await (0, import_samepercentCheck.SamePercentCheck)(CurrentDrop);
      await (0, import_pointsCheck.pointsCheck)(DropcurrentlyWatching).then((points) => {
        import_winston.default.info(import_chalk.default.gray("Watching " + import_chalk.default.white(DropcurrentlyWatching) + " | Points: " + import_chalk.default.white(points.toString())), { event: "progress" });
      });
      for (const [i, drop] of CurrentDrop.timebasedrop.entries()) {
        let dropslenght = CurrentDrop.timebasedrop.length;
        import_winston.default.info(import_chalk.default.gray("Current Progress: ") + import_chalk.default.white((0, import_util.minutestoPercent)(drop.self.currentMinutesWatched, drop.requiredMinutesWatched) + " %") + import_chalk.default.gray(" | Watched " + import_chalk.default.white(drop.self.currentMinutesWatched + "/" + drop.requiredMinutesWatched) + " Minutes" + import_chalk.default.gray(" | Drop ") + import_chalk.default.white(i + 1 + "/" + dropslenght) + import_chalk.default.gray(" | Status ") + import_chalk.default.white(drop.self.status) + import_chalk.default.gray(" | isClaimed ") + import_chalk.default.white(drop.self.isClaimed)), { event: "progress" });
      }
      import_winston.default.silly(" ", { event: "progressEnd" });
      await sendMinuteWatched(DropcurrentlyWatching);
    });
    if (import__.userdata.settings.debug)
      import_winston.default.info("Interval Executed");
    if (status === "running")
      await loop(DropcurrentlyWatching);
  }
}
async function WatchingEventHandlerStop() {
  status = "stopped";
}
async function sendMinuteWatched(ChannelLogin) {
  let opts = {
    "channelLogin": ChannelLogin
  };
  let Stream = await TwitchGQL._SendQuery("UseLive", opts, "639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9", "OAuth " + import__.userdata.auth_token, true);
  let channleid = Stream[0].data.user.id;
  let broadcastid = Stream[0].data.user.stream.id;
  const gethtml = await import_axios.default.get("https://www.twitch.tv/" + ChannelLogin, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
      "encoding": "utf8",
      "Client-Id": import__.userdata.clientid,
      "Authorization": "OAuth " + import__.userdata.auth_token
    },
    raxConfig: import_util.retryConfig
  }).catch((err) => {
    import_winston.default.error("ERROR: Could not load https://www.twitch.tv... Check your connection...");
    throw err;
  });
  let SettingsJSReg = new RegExp("https://static.twitchcdn.net/config/settings.[0-9a-f]{32}.js");
  let parsehtml = SettingsJSReg.exec(gethtml.data.toString());
  if (parsehtml[0] === null)
    import_winston.default.error("Error while parsing Settings Url...");
  const getSettingsJS = await import_axios.default.get(parsehtml[0].toString(), { raxConfig: import_util.retryConfig }).catch((err) => {
    import_winston.default.error("ERROR: Could not load your twitch settings... Check your connection...");
    throw err;
  });
  let SpadeReg = new RegExp("(https://video-edge-[.\\w\\-/]+\\.ts)");
  let parseJS = SpadeReg.exec(getSettingsJS.data.toString());
  if (parseJS[0] === null)
    import_winston.default.error("Error while parsing Spade URL...");
  let payload = [
    {
      "event": "minute-watched",
      "properties": {
        "channel_id": channleid.toString(),
        "broadcast_id": broadcastid.toString(),
        "player": "site",
        "user_id": import__.userdata.userid.toString()
      }
    }
  ];
  let json_event = JSON.stringify(payload);
  let b64 = Base64.encode(json_event);
  let config = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
      "Content-type": "text/plain"
    },
    raxConfig: import_util.retryConfig
  };
  const post = await import_axios.default.post(parseJS[0].toString(), b64, config).catch((err) => {
    import_winston.default.error("ERROR: Could not send minute watching event...");
    throw err;
  });
  if (import__.userdata.settings.debug) {
    import_winston.default.info("minute sent!!" + post?.status);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WatchingEventHandlerStart,
  WatchingEventHandlerStop,
  sendMinuteWatched
});
//# sourceMappingURL=watchpageHandler.js.map
