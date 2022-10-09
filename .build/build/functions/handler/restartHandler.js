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
exports.restartHandler = void 0;
const watchpageHandler_1 = require("./watchpageHandler");
const getTwitchDrops_1 = require("../get/getTwitchDrops");
const startWatching_1 = require("../startWatching");
const index_1 = require("../../index");
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("../../utils/util");
function restartHandler(random, filterlive, filterNonActive, filterlast, newgame) {
  return __awaiter(this, void 0, void 0, function* () {
    if (!newgame) {
      yield (0, watchpageHandler_1.WatchingEventHandlerStop)();
      yield (0, getTwitchDrops_1.askWhatDropToStart)(random, filterlive, filterNonActive, filterlast);
      yield (0, startWatching_1.startWatching)();
    } else if (newgame && index_1.userdata.settings.Prioritylist.length > 0) {
      yield (0, watchpageHandler_1.WatchingEventHandlerStop)();
      yield selectGamefromList();
      yield (0, getTwitchDrops_1.getTwitchDrops)(index_1.userdata.game, true).then(() => __awaiter(this, void 0, void 0, function* () {
        yield (0, getTwitchDrops_1.askWhatDropToStart)(random, filterlive, filterNonActive, filterlast);
        yield (0, startWatching_1.startWatching)();
      }));
    } else {
      yield (0, watchpageHandler_1.WatchingEventHandlerStop)();
      yield (0, getTwitchDrops_1.askWhatGameToWatch)(true);
      yield (0, getTwitchDrops_1.getTwitchDrops)(index_1.userdata.game, true).then(() => __awaiter(this, void 0, void 0, function* () {
        yield (0, getTwitchDrops_1.askWhatDropToStart)(random, filterlive, filterNonActive, filterlast);
        yield (0, startWatching_1.startWatching)();
      }));
    }
  });
}
exports.restartHandler = restartHandler;
function selectGamefromList() {
  return __awaiter(this, void 0, void 0, function* () {
    let activecampainnames = yield (0, getTwitchDrops_1.getActiveCampaigns)();
    if (index_1.userdata.settings.Prioritylist.length === 0) {
      winston_1.default.warn(chalk_1.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
      index_1.userdata.game = activecampainnames[(0, util_1.getRandomInt)(index_1.userdata.availableDropNameChoices.length)];
      winston_1.default.info(chalk_1.default.gray("Selected a random Game to watch: " + chalk_1.default.white(index_1.userdata.game)));
    } else {
      let gameselected = "";
      for (const [i, game] of index_1.userdata.settings.Prioritylist.entries()) {
        if (index_1.userdata.game === game) {
          if (index_1.userdata.settings.Prioritylist.length - 1 === i) {
            gameselected = index_1.userdata.settings.Prioritylist[0];
          } else {
            gameselected = index_1.userdata.settings.Prioritylist[i + 1];
          }
        }
      }
      if (gameselected === "")
        gameselected = index_1.userdata.settings.Prioritylist[0];
      index_1.userdata.game = gameselected;
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("Selected ") + chalk_1.default.white(gameselected) + chalk_1.default.gray(" as next game from your Priority list... Watching in 45 seconds..."), { event: "newGame" });
      winston_1.default.silly(" ", { event: "progressEnd" });
      yield (0, util_1.delay)(45e3);
    }
  });
}
//# sourceMappingURL=restartHandler.js.map
