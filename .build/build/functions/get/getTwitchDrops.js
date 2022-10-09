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
exports.getActiveCampaigns = exports.askWhatGameToWatch = exports.askWhatDropToStart = exports.getTwitchDrops = void 0;
const index_1 = require("../../index");
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("../../utils/util");
const findLiveChannel_1 = require("../findLiveChannel");
const claimCheck_1 = require("../../Checks/claimCheck");
const dateCheck_1 = require("../../Checks/dateCheck");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
const inquirer = require("inquirer");
function getTwitchDrops(game, feedback) {
  return __awaiter(this, void 0, void 0, function* () {
    index_1.userdata.drops = [];
    let dropidstoget = [];
    const DropCampaignDetails = yield TwitchGQL._SendQuery("ViewerDropsDashboard", {}, "", "OAuth " + index_1.userdata.auth_token, true, {}, true);
    index_1.userdata.userid = DropCampaignDetails[0].data.currentUser.id;
    let allDropCampaings = DropCampaignDetails[0].data.currentUser.dropCampaigns;
    if (index_1.userdata.settings.debug)
      winston_1.default.info("DropCampain %o", JSON.stringify(DropCampaignDetails, null, 2));
    yield allDropCampaings.forEach((campaign) => {
      if (campaign.status === "ACTIVE") {
        if (campaign.game.displayName === game) {
          dropidstoget.push(campaign.id);
        }
      }
    });
    if (feedback) {
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("Getting all available Drops..."), { event: "get" });
    }
    for (const e of dropidstoget) {
      let opts = {
        channelLogin: index_1.userdata.userid,
        dropID: e
      };
      const DropDetails = yield TwitchGQL._SendQuery("DropCampaignDetails", opts, "f6396f5ffdde867a8f6f6da18286e4baf02e5b98d14689a69b5af320a4c7b7b8", "OAuth " + index_1.userdata.auth_token, true, {}, true);
      let CampaignDetails = DropDetails[0].data.user.dropCampaign;
      index_1.userdata.drops.push({
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
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("Looking for a Live Channel..."), { event: "get" });
    }
    for (const e of index_1.userdata.drops) {
      let livechs = yield (0, findLiveChannel_1.findLiveChannel)(e.allowedchannels);
      if (livechs.length !== 0) {
        e.live = true;
        e.foundlivech.push(livechs[0]);
      } else {
        e.live = false;
      }
    }
    if (feedback) {
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("Checking your Inventory for started Drops..."), { event: "get" });
    }
    const rawInventory = yield TwitchGQL._SendQuery("Inventory", {}, "27f074f54ff74e0b05c8244ef2667180c2f911255e589ccd693a1a52ccca7367", "OAuth " + index_1.userdata.auth_token, true, {}, true);
    let Inventory = rawInventory[0].data.currentUser.inventory;
    if (index_1.userdata.settings.debug)
      winston_1.default.info("rawinventory %o", JSON.stringify(rawInventory, null, 2));
    Inventory.gameEventDrops.forEach((claimeddrop) => {
      index_1.userdata.claimedDrops.push({
        id: claimeddrop.id,
        imageurl: claimeddrop.imageURL,
        name: claimeddrop.name,
        game: claimeddrop.game
      });
    });
    index_1.userdata.drops.forEach((DropElement) => {
      if (Inventory.dropCampaignsInProgress !== null) {
        Inventory.dropCampaignsInProgress.forEach((e) => {
          if (DropElement.dropid === e.id) {
            DropElement.timebasedrop = e.timeBasedDrops;
          }
        });
      } else {
        if (index_1.userdata.settings.debug)
          winston_1.default.info("No Drops in Progress...");
      }
    });
    index_1.userdata.drops.forEach((drop) => {
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
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("Checking your Inventory for claimed Drops..."), { event: "get" });
    }
    yield (0, claimCheck_1.matchClaimedDrops)();
    for (const drop of index_1.userdata.drops) {
      yield (0, dateCheck_1.dateCheck)(drop, true);
      yield (0, claimCheck_1.claimableCheck)(drop, index_1.userdata.settings.AutoClaim, true);
    }
    if (feedback) {
      index_1.userdata.drops.forEach((drop) => {
        winston_1.default.silly(" ");
        winston_1.default.info((0, util_1.livechresponse)(drop.foundlivech) + " | " + chalk_1.default.magenta(drop.dropname) + " | " + (0, util_1.statustoString)(drop.live) + " | " + (0, util_1.claimedstatustoString)(drop.isClaimed), { event: "getResult" });
      });
    }
  });
}
exports.getTwitchDrops = getTwitchDrops;
function askWhatDropToStart(random, filterlive, filterNonActive, filterlast) {
  return __awaiter(this, void 0, void 0, function* () {
    index_1.userdata.availableDropNameChoices = [];
    index_1.userdata.drops.forEach((drop) => {
      if (filterlive) {
        if (drop.live) {
          index_1.userdata.availableDropNameChoices.push(drop.dropname);
        }
      } else {
        index_1.userdata.availableDropNameChoices.push(drop.dropname);
      }
    });
    if (filterNonActive) {
      for (const [i, DropName] of index_1.userdata.availableDropNameChoices.entries()) {
        if (index_1.userdata.nonActiveDrops.includes(DropName)) {
          index_1.userdata.availableDropNameChoices.splice(i, 1);
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.yellow(DropName + " | was removed because the drop ended or not started yet..."));
        }
      }
    }
    if (filterlast) {
      for (const [i, choice] of index_1.userdata.availableDropNameChoices.entries()) {
        if (choice === index_1.userdata.startDrop) {
          index_1.userdata.availableDropNameChoices.splice(i, 1);
        }
      }
    }
    if (index_1.userdata.availableDropNameChoices.length === 0) {
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("All available Channels Offline... Select any Drop to start watching..."));
      index_1.userdata.drops.forEach((drop) => {
        index_1.userdata.availableDropNameChoices.push(drop.dropname);
      });
    }
    winston_1.default.silly(" ");
    if (!random) {
      yield inquirer.prompt([
        {
          type: "list",
          name: "namelist",
          message: "What Drop do you wanna start Watching?",
          choices: index_1.userdata.availableDropNameChoices
        }
      ]).then((answer) => __awaiter(this, void 0, void 0, function* () {
        index_1.userdata.startDrop = answer.namelist;
      }));
    } else {
      index_1.userdata.startDrop = index_1.userdata.availableDropNameChoices[(0, util_1.getRandomInt)(index_1.userdata.availableDropNameChoices.length)];
      winston_1.default.info(chalk_1.default.gray("Selected a random drop to watch: " + chalk_1.default.white(index_1.userdata.startDrop)));
    }
  });
}
exports.askWhatDropToStart = askWhatDropToStart;
function askWhatGameToWatch(random) {
  return __awaiter(this, void 0, void 0, function* () {
    let activecampainnames = yield getActiveCampaigns();
    winston_1.default.silly(" ");
    if (!index_1.userdata.settings.displayless) {
      if (!random) {
        yield inquirer.prompt([
          {
            type: "list",
            name: "namelist",
            message: "What Game do you wanna watch?",
            choices: activecampainnames
          }
        ]).then((answer) => __awaiter(this, void 0, void 0, function* () {
          index_1.userdata.game = answer.namelist;
        }));
      } else {
        index_1.userdata.game = activecampainnames[(0, util_1.getRandomInt)(index_1.userdata.availableDropNameChoices.length)];
        winston_1.default.info(chalk_1.default.gray("Selected a random game to watch: " + chalk_1.default.white(index_1.userdata.game)));
      }
    } else {
      if (index_1.userdata.settings.Prioritylist.length === 0) {
        winston_1.default.warn(chalk_1.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
        index_1.userdata.game = activecampainnames[(0, util_1.getRandomInt)(index_1.userdata.availableDropNameChoices.length)];
        winston_1.default.info(chalk_1.default.gray("Selected a random Game to watch: " + chalk_1.default.white(index_1.userdata.game)));
      } else {
        index_1.userdata.game = index_1.userdata.settings.Prioritylist[0];
        winston_1.default.info(chalk_1.default.gray("Selected a Game from your Priority List watch: " + index_1.userdata.game));
      }
    }
  });
}
exports.askWhatGameToWatch = askWhatGameToWatch;
function getActiveCampaigns() {
  return __awaiter(this, void 0, void 0, function* () {
    let activecampainnames = [];
    winston_1.default.silly(" ");
    winston_1.default.info(chalk_1.default.gray("Getting all active Campaigns..."), { event: "get" });
    const DropCampaignDetails = yield TwitchGQL._SendQuery("ViewerDropsDashboard", {}, "", "OAuth " + index_1.userdata.auth_token, true, {}, true);
    let allDropCampaings = DropCampaignDetails[0].data.currentUser.dropCampaigns;
    yield allDropCampaings.forEach((campaign) => {
      if (campaign.status === "ACTIVE") {
        if (activecampainnames.includes(campaign.game.displayName) === false) {
          activecampainnames.push(campaign.game.displayName);
        }
      }
    });
    if (index_1.userdata.settings.Prioritylist.length > 0) {
      for (let i = index_1.userdata.settings.Prioritylist.length; i--; ) {
        if (!activecampainnames.includes(index_1.userdata.settings.Prioritylist[i])) {
          winston_1.default.info(chalk_1.default.yellow("Removed " + index_1.userdata.settings.Prioritylist[i] + " from the Priority List, because there is no ACTIVE campaign with such name."));
          index_1.userdata.settings.Prioritylist.splice(i, 1);
        }
      }
    }
    return activecampainnames;
  });
}
exports.getActiveCampaigns = getActiveCampaigns;
//# sourceMappingURL=getTwitchDrops.js.map
