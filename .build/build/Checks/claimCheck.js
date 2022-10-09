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
exports.matchClaimedDrops = exports.claimableCheck = void 0;
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const restartHandler_1 = require("../functions/handler/restartHandler");
const index_1 = require("../index");
const util_1 = require("../utils/util");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
function claimableCheck(CurrentDrop, autoclaim, onlycheck) {
  return __awaiter(this, void 0, void 0, function* () {
    let nonworkingamount = 0;
    let notavaiableyet = 0;
    let preconditions = false;
    CurrentDrop.timebasedrop.forEach((timedrop) => {
      if (!timedrop.self.isClaimed && timedrop.self.status === "Not Active" || !timedrop.self.isClaimed && timedrop.self.status === "Ended") {
        nonworkingamount++;
      }
      if (!timedrop.self.isClaimed && timedrop.self.status === "Not Active") {
        notavaiableyet++;
      }
      if (timedrop.preconditionDrops !== null) {
        preconditions = true;
      }
    });
    let workingdropslenght = CurrentDrop.timebasedrop.length - nonworkingamount;
    let hundredpercent = 0;
    let isclaimedamount = 0;
    for (const timedrop of CurrentDrop.timebasedrop) {
      if (timedrop.requiredMinutesWatched === timedrop.self.currentMinutesWatched) {
        hundredpercent++;
      }
      if (timedrop.self.isClaimed) {
        isclaimedamount++;
      }
      if (autoclaim || preconditions) {
        for (const benefit of timedrop.benefitEdges) {
          if (timedrop.self.currentMinutesWatched === timedrop.requiredMinutesWatched && timedrop.self.dropInstanceID !== null) {
            let opts = {
              "input": {
                "dropInstanceID": timedrop.self.dropInstanceID.toString()
              }
            };
            try {
              yield TwitchGQL._SendQuery("DropsPage_ClaimDropRewards", opts, "a455deea71bdc9015b78eb49f4acfbce8baa7ccbedd28e549bb025bd0f751930", "OAuth " + index_1.userdata.auth_token, true, {}, true);
              if (autoclaim)
                winston_1.default.info(chalk_1.default.gray("Claimed " + chalk_1.default.green(timedrop.name)), { event: "claim" });
              if (preconditions && !autoclaim)
                winston_1.default.info(chalk_1.default.gray("Claimed " + chalk_1.default.green(timedrop.name) + " because otherwise cant watch next drop..."), { event: "claim" });
            } catch (e) {
              if (autoclaim)
                winston_1.default.info(chalk_1.default.gray("There was an error trying to claim " + chalk_1.default.green(timedrop.name) + " Will retry again."), { event: "claim" });
            }
          }
        }
      }
    }
    if (index_1.userdata.settings.debug)
      winston_1.default.info("Claim CHECK ONE " + hundredpercent + " | " + workingdropslenght + " | " + isclaimedamount + " | " + nonworkingamount + " | " + notavaiableyet);
    if (!onlycheck)
      yield allgameddropsclaimableCheck();
    if (workingdropslenght !== CurrentDrop.timebasedrop.length && notavaiableyet >= isclaimedamount + hundredpercent) {
      if (!onlycheck) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.green("Got all available Drops, missing Drops are not active yet... Looking for new ones..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    } else if (workingdropslenght === 0) {
      if (!onlycheck) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.green("All available Drops for Current Drop are unavailable... Looking for new ones..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    } else if (hundredpercent >= workingdropslenght) {
      if (!onlycheck) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.green("All available Drops for Current Drop Claimable... Looking for new ones..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    } else if (isclaimedamount >= workingdropslenght) {
      CurrentDrop.isClaimed = true;
      if (!onlycheck) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.green("All Drops for Current Drop Claimed... Looking for new ones..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    } else if (isclaimedamount + hundredpercent >= workingdropslenght) {
      if (!onlycheck) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.green("All available Drops for Current Drop Claimable or Claimed... Looking for new ones..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    } else {
      nonworkingamount = 0;
      hundredpercent = 0;
      isclaimedamount = 0;
    }
  });
}
exports.claimableCheck = claimableCheck;
function allgameddropsclaimableCheck() {
  return __awaiter(this, void 0, void 0, function* () {
    let nonworkingamount = 0;
    let amount = 0;
    let isclaimedorclaimableamount = 0;
    let offlinedrops = 0;
    for (const drop of index_1.userdata.drops) {
      drop.timebasedrop.forEach((timedrop) => {
        amount++;
        if (!timedrop.self.isClaimed && timedrop.self.status === "Not Active" || !timedrop.self.isClaimed && timedrop.self.status === "Ended") {
          nonworkingamount++;
        } else if (timedrop.requiredMinutesWatched === timedrop.self.currentMinutesWatched || timedrop.self.isClaimed === true) {
          isclaimedorclaimableamount++;
        } else if (timedrop.self.status === "Active" && !drop.live) {
          offlinedrops++;
        }
      });
    }
    if (index_1.userdata.settings.debug)
      winston_1.default.info("Claim CHECK LOOP " + isclaimedorclaimableamount + " | " + amount + " | " + nonworkingamount + " | " + offlinedrops);
    if (isclaimedorclaimableamount >= amount - nonworkingamount) {
      winston_1.default.silly(" ");
      if (index_1.userdata.settings.Prioritylist.length === 0)
        winston_1.default.warn(chalk_1.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings... or disable this feature in the settings..."));
      winston_1.default.info(chalk_1.default.green("All available drops of the game claimed or claimable... Looking for a new Game...."), { event: "newGame" });
      yield (0, restartHandler_1.restartHandler)(true, true, true, true, true);
    } else if (isclaimedorclaimableamount >= amount - nonworkingamount - offlinedrops) {
      winston_1.default.silly(" ");
      if (index_1.userdata.settings.WaitforChannels) {
        winston_1.default.info(chalk_1.default.green("All available Live Drops of the game claimed or claimable... Looking for new Live Drop in 5 Minutes...."), { event: "newDrop" });
        winston_1.default.silly(" ", { event: "progressEnd" });
        yield (0, util_1.delay)(3e5);
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      } else {
        if (index_1.userdata.settings.Prioritylist.length === 0)
          winston_1.default.warn(chalk_1.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
        winston_1.default.info(chalk_1.default.green("All available Live Drops of the game claimed or claimable... Looking for a new Game...."), { event: "newGame" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, true);
      }
    }
  });
}
function matchClaimedDrops() {
  return __awaiter(this, void 0, void 0, function* () {
    index_1.userdata.claimedDrops.forEach((claimeddrop) => {
      index_1.userdata.drops.forEach((drop) => {
        drop.timebasedrop.forEach((timebasedrop) => {
          timebasedrop.benefitEdges.forEach((benefit) => {
            if (claimeddrop.imageurl.toString() === benefit.benefit.imageAssetURL.toString()) {
              for (const [i, drops] of drop.timebasedrop.entries()) {
                if (drops.self.isClaimed === null) {
                  drop.isClaimed = true;
                }
              }
            }
          });
        });
      });
    });
    index_1.userdata.drops.forEach((drop) => {
      drop.timebasedrop.forEach((timebasedrop) => {
        if (drop.isClaimed && timebasedrop.self.isClaimed === null) {
          timebasedrop["self"] = {
            __typename: "TimeBasedDropSelfEdge",
            currentMinutesWatched: 0,
            dropInstanceID: null,
            isClaimed: true
          };
        }
      });
    });
  });
}
exports.matchClaimedDrops = matchClaimedDrops;
//# sourceMappingURL=claimCheck.js.map
