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
  claimableCheck: () => claimableCheck,
  matchClaimedDrops: () => matchClaimedDrops
});
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_restartHandler = __toModule(require("../functions/handler/restartHandler"));
var import__ = __toModule(require("../index"));
var import_util = __toModule(require("../utils/util"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
async function claimableCheck(CurrentDrop, autoclaim, onlycheck) {
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
            await TwitchGQL._SendQuery("DropsPage_ClaimDropRewards", opts, "a455deea71bdc9015b78eb49f4acfbce8baa7ccbedd28e549bb025bd0f751930", "OAuth " + import__.userdata.auth_token, true, {}, true);
            if (autoclaim)
              import_winston.default.info(import_chalk.default.gray("Claimed " + import_chalk.default.green(timedrop.name)), { event: "claim" });
            if (preconditions && !autoclaim)
              import_winston.default.info(import_chalk.default.gray("Claimed " + import_chalk.default.green(timedrop.name) + " because otherwise cant watch next drop..."), { event: "claim" });
          } catch (e) {
            if (autoclaim)
              import_winston.default.info(import_chalk.default.gray("There was an error trying to claim " + import_chalk.default.green(timedrop.name) + " Will retry again."), { event: "claim" });
          }
        }
      }
    }
  }
  if (import__.userdata.settings.debug)
    import_winston.default.info("Claim CHECK ONE " + hundredpercent + " | " + workingdropslenght + " | " + isclaimedamount + " | " + nonworkingamount + " | " + notavaiableyet);
  if (!onlycheck)
    await allgameddropsclaimableCheck();
  if (workingdropslenght !== CurrentDrop.timebasedrop.length && notavaiableyet >= isclaimedamount + hundredpercent) {
    if (!onlycheck) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("Got all available Drops, missing Drops are not active yet... Looking for new ones..."), { event: "newDrop" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  } else if (workingdropslenght === 0) {
    if (!onlycheck) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("All available Drops for Current Drop are unavailable... Looking for new ones..."), { event: "newDrop" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  } else if (hundredpercent >= workingdropslenght) {
    if (!onlycheck) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("All available Drops for Current Drop Claimable... Looking for new ones..."), { event: "newDrop" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  } else if (isclaimedamount >= workingdropslenght) {
    CurrentDrop.isClaimed = true;
    if (!onlycheck) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("All Drops for Current Drop Claimed... Looking for new ones..."), { event: "newDrop" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  } else if (isclaimedamount + hundredpercent >= workingdropslenght) {
    if (!onlycheck) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("All available Drops for Current Drop Claimable or Claimed... Looking for new ones..."), { event: "newDrop" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  } else {
    nonworkingamount = 0;
    hundredpercent = 0;
    isclaimedamount = 0;
  }
}
async function allgameddropsclaimableCheck() {
  let nonworkingamount = 0;
  let amount = 0;
  let isclaimedorclaimableamount = 0;
  let offlinedrops = 0;
  for (const drop of import__.userdata.drops) {
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
  if (import__.userdata.settings.debug)
    import_winston.default.info("Claim CHECK LOOP " + isclaimedorclaimableamount + " | " + amount + " | " + nonworkingamount + " | " + offlinedrops);
  if (isclaimedorclaimableamount >= amount - nonworkingamount) {
    import_winston.default.silly(" ");
    if (import__.userdata.settings.Prioritylist.length === 0)
      import_winston.default.warn(import_chalk.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings... or disable this feature in the settings..."));
    import_winston.default.info(import_chalk.default.green("All available drops of the game claimed or claimable... Looking for a new Game...."), { event: "newGame" });
    await (0, import_restartHandler.restartHandler)(true, true, true, true, true);
  } else if (isclaimedorclaimableamount >= amount - nonworkingamount - offlinedrops) {
    import_winston.default.silly(" ");
    if (import__.userdata.settings.WaitforChannels) {
      import_winston.default.info(import_chalk.default.green("All available Live Drops of the game claimed or claimable... Looking for new Live Drop in 5 Minutes...."), { event: "newDrop" });
      import_winston.default.silly(" ", { event: "progressEnd" });
      await (0, import_util.delay)(3e5);
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    } else {
      if (import__.userdata.settings.Prioritylist.length === 0)
        import_winston.default.warn(import_chalk.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
      import_winston.default.info(import_chalk.default.green("All available Live Drops of the game claimed or claimable... Looking for a new Game...."), { event: "newGame" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, true);
    }
  }
}
async function matchClaimedDrops() {
  import__.userdata.claimedDrops.forEach((claimeddrop) => {
    import__.userdata.drops.forEach((drop) => {
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
  import__.userdata.drops.forEach((drop) => {
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  claimableCheck,
  matchClaimedDrops
});
//# sourceMappingURL=claimCheck.js.map
