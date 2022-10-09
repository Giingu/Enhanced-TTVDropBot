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
exports.customallOfflineCheck = exports.allOfflineCheck = exports.liveCheck = void 0;
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const restartHandler_1 = require("../functions/handler/restartHandler");
const util_1 = require("../utils/util");
const index_1 = require("../index");
const custompageHandler_1 = require("../functions/handler/custompageHandler");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
function liveCheck(channelLogin, custom) {
  return __awaiter(this, void 0, void 0, function* () {
    if (channelLogin !== void 0) {
      let status = yield TwitchGQL.GetLiveStatus(channelLogin);
      if (!status) {
        winston_1.default.info(chalk_1.default.red("Current Channel offline... Looking for new one..."), { event: "offline" });
        if (custom) {
          yield (0, custompageHandler_1.customrestartHandler)(true);
        } else {
          yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
        }
      }
    } else {
      winston_1.default.info(chalk_1.default.red("No Channel Live at the moment for this Drop... Looking for new one..."), { event: "offline" });
      if (custom) {
        yield (0, custompageHandler_1.customrestartHandler)(true);
      } else {
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    }
  });
}
exports.liveCheck = liveCheck;
function allOfflineCheck() {
  return __awaiter(this, void 0, void 0, function* () {
    let dropsoffline = 0;
    index_1.userdata.drops.forEach((drop) => {
      if (!drop.live) {
        dropsoffline++;
      }
    });
    if (dropsoffline === index_1.userdata.drops.length) {
      if (index_1.userdata.settings.WaitforChannels && index_1.userdata.settings.Prioritylist.length === 0) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.red("All Drops for this game are offline... Looking for new live Channels in 5 minutes..."), { event: "offline" });
        winston_1.default.silly(" ", { event: "progressEnd" });
        yield (0, util_1.delay)(3e5);
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      } else {
        winston_1.default.silly(" ");
        if (index_1.userdata.settings.Prioritylist.length === 0)
          winston_1.default.warn(chalk_1.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
        winston_1.default.info(chalk_1.default.red("All Drops for this game are offline... Looking for new game..."), { event: "newGame" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, true);
      }
    }
  });
}
exports.allOfflineCheck = allOfflineCheck;
function customallOfflineCheck() {
  return __awaiter(this, void 0, void 0, function* () {
    let dropsoffline = 0;
    index_1.userdata.customchannel.forEach((drop) => {
      if (!drop.live) {
        dropsoffline++;
      }
    });
    if (dropsoffline === index_1.userdata.customchannel.length) {
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.red("All Channels are offline... Looking for new live Channels in 5 minutes..."), { event: "offline" });
      winston_1.default.silly(" ", { event: "progressEnd" });
      yield (0, util_1.delay)(3e5);
      yield (0, custompageHandler_1.customrestartHandler)(true);
    }
  });
}
exports.customallOfflineCheck = customallOfflineCheck;
//# sourceMappingURL=liveCheck.js.map
