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
exports.sendMinuteWatched = exports.WatchingEventHandlerStop = exports.WatchingEventHandlerStart = void 0;
const getTwitchDrops_1 = require("../get/getTwitchDrops");
const index_1 = require("../../index");
const liveCheck_1 = require("../../Checks/liveCheck");
const winston_1 = __importDefault(require("winston"));
const getCurrentDrop_1 = require("../get/getCurrentDrop");
const util_1 = require("../../utils/util");
const dateCheck_1 = require("../../Checks/dateCheck");
const axios_1 = __importDefault(require("axios"));
const claimCheck_1 = require("../../Checks/claimCheck");
const chalk_1 = __importDefault(require("chalk"));
const samepercentCheck_1 = require("../../Checks/samepercentCheck");
const pointsCheck_1 = require("../../Checks/pointsCheck");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init(index_1.userdata.clientid);
const { Base64 } = require("js-base64");
let status = "stopped";
function WatchingEventHandlerStart(DropcurrentlyWatching) {
  return __awaiter(this, void 0, void 0, function* () {
    if (status === "stopped") {
      yield (0, getTwitchDrops_1.getTwitchDrops)(index_1.userdata.game, false);
      yield (0, liveCheck_1.allOfflineCheck)();
      yield (0, liveCheck_1.liveCheck)(DropcurrentlyWatching, false);
      yield sendMinuteWatched(DropcurrentlyWatching.toString().toLowerCase());
      status = "running";
      yield loop(DropcurrentlyWatching);
    } else if (status === "running") {
      yield loop(DropcurrentlyWatching);
    }
  });
}
exports.WatchingEventHandlerStart = WatchingEventHandlerStart;
function loop(DropcurrentlyWatching) {
  return __awaiter(this, void 0, void 0, function* () {
    yield (0, util_1.delay)(index_1.userdata.settings.ProgressCheckInterval);
    if (index_1.userdata.settings.debug)
      winston_1.default.info("UserDATA %o", JSON.stringify(index_1.userdata, null, 2));
    yield (0, getTwitchDrops_1.getTwitchDrops)(index_1.userdata.game, false);
    yield (0, liveCheck_1.allOfflineCheck)();
    if (status === "running") {
      yield (0, getCurrentDrop_1.getCurrentDrop)().then((CurrentDrop) => __awaiter(this, void 0, void 0, function* () {
        if (index_1.userdata.settings.debug)
          winston_1.default.info("CurrentDrop %o", JSON.stringify(CurrentDrop, null, 2));
        if (!CurrentDrop.foundlivech.includes(DropcurrentlyWatching) && CurrentDrop.foundlivech.length > 0) {
          DropcurrentlyWatching = CurrentDrop.foundlivech[0];
          winston_1.default.info(chalk_1.default.gray("Switched current Channel to " + chalk_1.default.white(DropcurrentlyWatching) + "..."));
          winston_1.default.silly(" ");
        }
        yield (0, liveCheck_1.liveCheck)(DropcurrentlyWatching, false);
        yield (0, claimCheck_1.claimableCheck)(CurrentDrop, index_1.userdata.settings.AutoClaim, false);
        yield (0, dateCheck_1.dateCheck)(CurrentDrop, false);
        yield (0, samepercentCheck_1.SamePercentCheck)(CurrentDrop);
        yield (0, pointsCheck_1.pointsCheck)(DropcurrentlyWatching).then((points) => {
          winston_1.default.info(chalk_1.default.gray("Watching " + chalk_1.default.white(DropcurrentlyWatching) + " | Points: " + chalk_1.default.white(points.toString())), { event: "progress" });
        });
        for (const [i, drop] of CurrentDrop.timebasedrop.entries()) {
          let dropslenght = CurrentDrop.timebasedrop.length;
          winston_1.default.info(chalk_1.default.gray("Current Progress: ") + chalk_1.default.white((0, util_1.minutestoPercent)(drop.self.currentMinutesWatched, drop.requiredMinutesWatched) + " %") + chalk_1.default.gray(" | Watched " + chalk_1.default.white(drop.self.currentMinutesWatched + "/" + drop.requiredMinutesWatched) + " Minutes" + chalk_1.default.gray(" | Drop ") + chalk_1.default.white(i + 1 + "/" + dropslenght) + chalk_1.default.gray(" | Status ") + chalk_1.default.white(drop.self.status) + chalk_1.default.gray(" | isClaimed ") + chalk_1.default.white(drop.self.isClaimed)), { event: "progress" });
        }
        winston_1.default.silly(" ", { event: "progressEnd" });
        yield sendMinuteWatched(DropcurrentlyWatching);
      }));
      if (index_1.userdata.settings.debug)
        winston_1.default.info("Interval Executed");
      if (status === "running")
        yield loop(DropcurrentlyWatching);
    }
  });
}
function WatchingEventHandlerStop() {
  return __awaiter(this, void 0, void 0, function* () {
    status = "stopped";
  });
}
exports.WatchingEventHandlerStop = WatchingEventHandlerStop;
function sendMinuteWatched(ChannelLogin) {
  return __awaiter(this, void 0, void 0, function* () {
    let opts = {
      "channelLogin": ChannelLogin
    };
    let Stream = yield TwitchGQL._SendQuery("UseLive", opts, "639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9", "OAuth " + index_1.userdata.auth_token, true);
    let channleid = Stream[0].data.user.id;
    let broadcastid = Stream[0].data.user.stream.id;
    const gethtml = yield axios_1.default.get("https://www.twitch.tv/" + ChannelLogin, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
        "encoding": "utf8",
        "Client-Id": index_1.userdata.clientid,
        "Authorization": "OAuth " + index_1.userdata.auth_token
      },
      raxConfig: util_1.retryConfig
    }).catch((err) => {
      winston_1.default.error("ERROR: Could not load https://www.twitch.tv... Check your connection...");
      throw err;
    });
    let SettingsJSReg = new RegExp("https://static.twitchcdn.net/config/settings.[0-9a-f]{32}.js");
    let parsehtml = SettingsJSReg.exec(gethtml.data.toString());
    if (parsehtml[0] === null)
      winston_1.default.error("Error while parsing Settings Url...");
    const getSettingsJS = yield axios_1.default.get(parsehtml[0].toString(), { raxConfig: util_1.retryConfig }).catch((err) => {
      winston_1.default.error("ERROR: Could not load your twitch settings... Check your connection...");
      throw err;
    });
    let SpadeReg = new RegExp("(https://video-edge-[.\\w\\-/]+\\.ts)");
    let parseJS = SpadeReg.exec(getSettingsJS.data.toString());
    if (parseJS[0] === null)
      winston_1.default.error("Error while parsing Spade URL...");
    let payload = [
      {
        "event": "minute-watched",
        "properties": {
          "channel_id": channleid.toString(),
          "broadcast_id": broadcastid.toString(),
          "player": "site",
          "user_id": index_1.userdata.userid.toString()
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
      raxConfig: util_1.retryConfig
    };
    const post = yield axios_1.default.post(parseJS[0].toString(), b64, config).catch((err) => {
      winston_1.default.error("ERROR: Could not send minute watching event...");
      throw err;
    });
    if (index_1.userdata.settings.debug) {
      winston_1.default.info("minute sent!!" + (post === null || post === void 0 ? void 0 : post.status));
    }
  });
}
exports.sendMinuteWatched = sendMinuteWatched;
//# sourceMappingURL=watchpageHandler.js.map
