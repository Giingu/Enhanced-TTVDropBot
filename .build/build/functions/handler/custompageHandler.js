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
exports.customrestartHandler = exports.CustomEventHandlerStart = void 0;
const index_1 = require("../../index");
const liveCheck_1 = require("../../Checks/liveCheck");
const watchpageHandler_1 = require("./watchpageHandler");
const pointsCheck_1 = require("../../Checks/pointsCheck");
const util_1 = require("../../utils/util");
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const getCustomChannel_1 = require("../get/getCustomChannel");
let status = "stopped";
function CustomEventHandlerStart(DropcurrentlyWatching) {
  return __awaiter(this, void 0, void 0, function* () {
    if (status === "stopped") {
      yield (0, liveCheck_1.customallOfflineCheck)();
      yield (0, liveCheck_1.liveCheck)(DropcurrentlyWatching, true);
      yield (0, pointsCheck_1.pointsCheck)(DropcurrentlyWatching);
      yield (0, watchpageHandler_1.sendMinuteWatched)(DropcurrentlyWatching.toString().toLowerCase());
      status = "running";
      yield customloop(DropcurrentlyWatching);
    } else if (status === "running") {
      yield customloop(DropcurrentlyWatching);
    }
  });
}
exports.CustomEventHandlerStart = CustomEventHandlerStart;
let watchedtime = 0;
function customloop(channelLogin) {
  return __awaiter(this, void 0, void 0, function* () {
    yield (0, util_1.delay)(index_1.userdata.settings.ProgressCheckInterval);
    watchedtime = watchedtime + index_1.userdata.settings.ProgressCheckInterval;
    yield getCustomDrop(channelLogin).then((currentdrop) => __awaiter(this, void 0, void 0, function* () {
      yield (0, getCustomChannel_1.customCheckLive)(false);
      yield (0, liveCheck_1.customallOfflineCheck)();
      yield (0, liveCheck_1.liveCheck)(channelLogin, true);
      let neededtimeinms = currentdrop.Time * 6e4;
      if (status === "running") {
        if (currentdrop.WatchType === "Watch until time runs out") {
          if (watchedtime < neededtimeinms) {
            yield (0, pointsCheck_1.pointsCheck)(channelLogin).then((points) => __awaiter(this, void 0, void 0, function* () {
              yield (0, watchpageHandler_1.sendMinuteWatched)(channelLogin.toString().toLowerCase());
              winston_1.default.info(chalk_1.default.gray("Watching since: ") + chalk_1.default.white(Number(watchedtime / 6e4).toFixed(2)) + chalk_1.default.gray(" | Minutes Left: " + chalk_1.default.white((neededtimeinms - watchedtime) / 6e4)) + chalk_1.default.gray(" | Points: ") + chalk_1.default.white(points.toString()), { event: "progress" });
              winston_1.default.silly("", { event: "progressEnd" });
              yield customloop(channelLogin);
            }));
          } else if (watchedtime >= neededtimeinms) {
            status = "stopped";
            winston_1.default.info(chalk_1.default.green("Finished watching the channel: " + channelLogin), { event: "newDrop" });
            winston_1.default.info(chalk_1.default.gray("Looking for a new Channel..."), { event: "newDrop" });
            yield customrestartHandler(true);
          }
        } else {
          yield (0, pointsCheck_1.pointsCheck)(channelLogin).then((points) => __awaiter(this, void 0, void 0, function* () {
            yield (0, watchpageHandler_1.sendMinuteWatched)(channelLogin.toString().toLowerCase());
            winston_1.default.info(chalk_1.default.gray("Watching since: ") + chalk_1.default.white(Number(watchedtime / 6e4).toFixed(2)) + chalk_1.default.gray(" | Points: ") + chalk_1.default.white(points.toString()), { event: "progress" });
            winston_1.default.silly("", { event: "progressEnd" });
            yield customloop(channelLogin);
          }));
        }
      }
    }));
  });
}
function customrestartHandler(random) {
  return __awaiter(this, void 0, void 0, function* () {
    watchedtime = 0;
    yield (0, getCustomChannel_1.customCheckLive)(false);
    yield (0, getCustomChannel_1.askCustomChannelStart)(random, true);
    yield CustomEventHandlerStart(index_1.userdata.startDrop);
  });
}
exports.customrestartHandler = customrestartHandler;
function getCustomDrop(ChannelLogin) {
  return __awaiter(this, void 0, void 0, function* () {
    let currentdrop = {
      Name: "",
      TTVLink: "",
      WatchType: "",
      Time: 0,
      Points: false,
      live: false
    };
    index_1.userdata.customchannel.forEach((drop) => {
      if (drop.TTVLink === "https://www.twitch.tv/" + ChannelLogin) {
        currentdrop = drop;
      }
    });
    return currentdrop;
  });
}
//# sourceMappingURL=custompageHandler.js.map
