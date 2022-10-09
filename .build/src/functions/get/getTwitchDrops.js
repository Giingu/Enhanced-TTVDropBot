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
  askWhatDropToStart: () => askWhatDropToStart,
  askWhatGameToWatch: () => askWhatGameToWatch,
  getActiveCampaigns: () => getActiveCampaigns,
  getTwitchDrops: () => getTwitchDrops
});
var import__ = __toModule(require("../../index"));
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_util = __toModule(require("../../utils/util"));
var import_findLiveChannel = __toModule(require("../findLiveChannel"));
var import_claimCheck = __toModule(require("../../Checks/claimCheck"));
var import_dateCheck = __toModule(require("../../Checks/dateCheck"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
const inquirer = require("inquirer");
async function getTwitchDrops(game, feedback) {
  import__.userdata.drops = [];
  let dropidstoget = [];
  const DropCampaignDetails = await TwitchGQL._SendQuery("ViewerDropsDashboard", {}, "", "OAuth " + import__.userdata.auth_token, true, {}, true);
  import__.userdata.userid = DropCampaignDetails[0].data.currentUser.id;
  let allDropCampaings = DropCampaignDetails[0].data.currentUser.dropCampaigns;
  if (import__.userdata.settings.debug)
    import_winston.default.info("DropCampain %o", JSON.stringify(DropCampaignDetails, null, 2));
  await allDropCampaings.forEach((campaign) => {
    if (campaign.status === "ACTIVE") {
      if (campaign.game.displayName === game) {
        dropidstoget.push(campaign.id);
      }
    }
  });
  if (feedback) {
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("Getting all available Drops..."), { event: "get" });
  }
  for (const e of dropidstoget) {
    let opts = {
      channelLogin: import__.userdata.userid,
      dropID: e
    };
    const DropDetails = await TwitchGQL._SendQuery("DropCampaignDetails", opts, "f6396f5ffdde867a8f6f6da18286e4baf02e5b98d14689a69b5af320a4c7b7b8", "OAuth " + import__.userdata.auth_token, true, {}, true);
    let CampaignDetails = DropDetails[0].data.user.dropCampaign;
    import__.userdata.drops.push({
      dropid: CampaignDetails.id,
      dropname: CampaignDetails.name,
      Connected: CampaignDetails.self.isAccountConnected,
      allowedchannels: CampaignDetails.allow.channels,
      timebasedrop: CampaignDetails.timeBasedDrops,
      live: false,
      foundlivech: [],
      isClaimed: false
    });
  }
  if (feedback) {
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("Looking for a Live Channel..."), { event: "get" });
  }
  for (const e of import__.userdata.drops) {
    let livechs = await (0, import_findLiveChannel.findLiveChannel)(e.allowedchannels);
    if (livechs.length !== 0) {
      e.live = true;
      e.foundlivech.push(livechs[0]);
    } else {
      e.live = false;
    }
  }
  if (feedback) {
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("Checking your Inventory for started Drops..."), { event: "get" });
  }
  const rawInventory = await TwitchGQL._SendQuery("Inventory", {}, "27f074f54ff74e0b05c8244ef2667180c2f911255e589ccd693a1a52ccca7367", "OAuth " + import__.userdata.auth_token, true, {}, true);
  let Inventory = rawInventory[0].data.currentUser.inventory;
  if (import__.userdata.settings.debug)
    import_winston.default.info("rawinventory %o", JSON.stringify(rawInventory, null, 2));
  Inventory.gameEventDrops.forEach((claimeddrop) => {
    import__.userdata.claimedDrops.push({
      id: claimeddrop.id,
      imageurl: claimeddrop.imageURL,
      name: claimeddrop.name,
      game: claimeddrop.game
    });
  });
  import__.userdata.drops.forEach((DropElement) => {
    if (Inventory.dropCampaignsInProgress !== null) {
      Inventory.dropCampaignsInProgress.forEach((e) => {
        if (DropElement.dropid === e.id) {
          DropElement.timebasedrop = e.timeBasedDrops;
        }
      });
    } else {
      if (import__.userdata.settings.debug)
        import_winston.default.info("No Drops in Progress...");
    }
  });
  import__.userdata.drops.forEach((drop) => {
    drop.timebasedrop.forEach((time) => {
      if (!("self" in time)) {
        time["self"] = {
          __typename: "TimeBasedDropSelfEdge",
          currentMinutesWatched: 0,
          dropInstanceID: null,
          isClaimed: null
        };
      }
    });
  });
  if (feedback) {
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("Checking your Inventory for claimed Drops..."), { event: "get" });
  }
  await (0, import_claimCheck.matchClaimedDrops)();
  for (const drop of import__.userdata.drops) {
    await (0, import_dateCheck.dateCheck)(drop, true);
    await (0, import_claimCheck.claimableCheck)(drop, import__.userdata.settings.AutoClaim, true);
  }
  if (feedback) {
    import__.userdata.drops.forEach((drop) => {
      import_winston.default.silly(" ");
      import_winston.default.info((0, import_util.livechresponse)(drop.foundlivech) + " | " + import_chalk.default.magenta(drop.dropname) + " | " + (0, import_util.statustoString)(drop.live) + " | " + (0, import_util.claimedstatustoString)(drop.isClaimed), { event: "getResult" });
    });
  }
}
async function askWhatDropToStart(random, filterlive, filterNonActive, filterlast) {
  import__.userdata.availableDropNameChoices = [];
  import__.userdata.drops.forEach((drop) => {
    if (filterlive) {
      if (drop.live) {
        import__.userdata.availableDropNameChoices.push(drop.dropname);
      }
    } else {
      import__.userdata.availableDropNameChoices.push(drop.dropname);
    }
  });
  if (filterNonActive) {
    for (const [i, DropName] of import__.userdata.availableDropNameChoices.entries()) {
      if (import__.userdata.nonActiveDrops.includes(DropName)) {
        import__.userdata.availableDropNameChoices.splice(i, 1);
        import_winston.default.silly(" ");
        import_winston.default.info(import_chalk.default.yellow(DropName + " | was removed because the drop ended or not started yet..."));
      }
    }
  }
  if (filterlast) {
    for (const [i, choice] of import__.userdata.availableDropNameChoices.entries()) {
      if (choice === import__.userdata.startDrop) {
        import__.userdata.availableDropNameChoices.splice(i, 1);
      }
    }
  }
  if (import__.userdata.availableDropNameChoices.length === 0) {
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("All available Channels Offline... Select any Drop to start watching..."));
    import__.userdata.drops.forEach((drop) => {
      import__.userdata.availableDropNameChoices.push(drop.dropname);
    });
  }
  import_winston.default.silly(" ");
  if (!random) {
    await inquirer.prompt([
      {
        type: "list",
        name: "namelist",
        message: "What Drop do you wanna start Watching?",
        choices: import__.userdata.availableDropNameChoices
      }
    ]).then(async (answer) => {
      import__.userdata.startDrop = answer.namelist;
    });
  } else {
    import__.userdata.startDrop = import__.userdata.availableDropNameChoices[(0, import_util.getRandomInt)(import__.userdata.availableDropNameChoices.length)];
    import_winston.default.info(import_chalk.default.gray("Selected a random drop to watch: " + import_chalk.default.white(import__.userdata.startDrop)));
  }
}
async function askWhatGameToWatch(random) {
  let activecampainnames = await getActiveCampaigns();
  import_winston.default.silly(" ");
  if (!import__.userdata.settings.displayless) {
    if (!random) {
      await inquirer.prompt([
        {
          type: "list",
          name: "namelist",
          message: "What Game do you wanna watch?",
          choices: activecampainnames
        }
      ]).then(async (answer) => {
        import__.userdata.game = answer.namelist;
      });
    } else {
      import__.userdata.game = activecampainnames[(0, import_util.getRandomInt)(import__.userdata.availableDropNameChoices.length)];
      import_winston.default.info(import_chalk.default.gray("Selected a random game to watch: " + import_chalk.default.white(import__.userdata.game)));
    }
  } else {
    if (import__.userdata.settings.Prioritylist.length === 0) {
      import_winston.default.warn(import_chalk.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
      import__.userdata.game = activecampainnames[(0, import_util.getRandomInt)(import__.userdata.availableDropNameChoices.length)];
      import_winston.default.info(import_chalk.default.gray("Selected a random Game to watch: " + import_chalk.default.white(import__.userdata.game)));
    } else {
      import__.userdata.game = import__.userdata.settings.Prioritylist[0];
      import_winston.default.info(import_chalk.default.gray("Selected a Game from your Priority List watch: " + import__.userdata.game));
    }
  }
}
async function getActiveCampaigns() {
  let activecampainnames = [];
  import_winston.default.silly(" ");
  import_winston.default.info(import_chalk.default.gray("Getting all active Campaigns..."), { event: "get" });
  const DropCampaignDetails = await TwitchGQL._SendQuery("ViewerDropsDashboard", {}, "", "OAuth " + import__.userdata.auth_token, true, {}, true);
  let allDropCampaings = DropCampaignDetails[0].data.currentUser.dropCampaigns;
  await allDropCampaings.forEach((campaign) => {
    if (campaign.status === "ACTIVE") {
      if (activecampainnames.includes(campaign.game.displayName) === false) {
        activecampainnames.push(campaign.game.displayName);
      }
    }
  });
  if (import__.userdata.settings.Prioritylist.length > 0) {
    for (let i = import__.userdata.settings.Prioritylist.length; i--; ) {
      if (!activecampainnames.includes(import__.userdata.settings.Prioritylist[i])) {
        import_winston.default.info(import_chalk.default.yellow("Removed " + import__.userdata.settings.Prioritylist[i] + " from the Priority List, because there is no ACTIVE campaign with such name."));
        import__.userdata.settings.Prioritylist.splice(i, 1);
      }
    }
  }
  return activecampainnames;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  askWhatDropToStart,
  askWhatGameToWatch,
  getActiveCampaigns,
  getTwitchDrops
});
//# sourceMappingURL=getTwitchDrops.js.map
