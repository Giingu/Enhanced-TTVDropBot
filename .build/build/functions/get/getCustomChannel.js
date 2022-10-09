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
exports.customCheckLive = exports.askCustomChannelStart = exports.getCustomChannel = void 0;
const fs_1 = __importDefault(require("fs"));
const index_1 = require("../../index");
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("../../utils/util");
const inputReader = require("wait-console-input");
const inquirer = require("inquirer");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
function getCustomChannel() {
  return __awaiter(this, void 0, void 0, function* () {
    const path = "./CustomChannels.json";
    if (!index_1.userdata.settings.displayless) {
      if (fs_1.default.existsSync(path)) {
        let customch = fs_1.default.readFileSync("./CustomChannels.json", "utf8");
        index_1.userdata.customchannel = JSON.parse(customch);
        if (index_1.userdata.customchannel.length === 0) {
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("No Custom Channels Found..."));
          yield createCustomChannel(true);
        }
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("Found " + index_1.userdata.customchannel.length + " Custom Channels..."));
        winston_1.default.silly(" ");
        yield addanotherone();
        yield customCheckLive(true);
        yield askCustomChannelStart(false, true);
      } else {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("No Custom Channels Found..."));
        yield createCustomChannel(false);
        if (index_1.userdata.customchannel.length === 0) {
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("No Custom Channels Created..."));
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("Closing Bot, No Custom Channels Added!"));
          if (!index_1.userdata.settings.displayless)
            inputReader.wait(chalk_1.default.gray("Press any Key to continue..."));
          process.exit(21);
        }
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("Found " + index_1.userdata.customchannel.length + " Custom Channels..."));
        winston_1.default.silly(" ");
        yield addanotherone();
        yield customCheckLive(true);
        yield askCustomChannelStart(false, true);
      }
    } else {
      const path2 = "./CustomChannels.json";
      if (fs_1.default.existsSync(path2)) {
        let customch = fs_1.default.readFileSync("./CustomChannels.json", "utf8");
        index_1.userdata.customchannel = JSON.parse(customch);
        if (index_1.userdata.customchannel.length === 0) {
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("No Custom Channels Found..."));
          process.exit(1);
        }
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("Found " + index_1.userdata.customchannel.length + " Custom Channels..."));
        winston_1.default.silly(" ");
        yield customCheckLive(true);
        yield askCustomChannelStart(true, true);
      } else {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("Closing Bot, somehow there is no Customchannels file anymore...!"));
        if (!index_1.userdata.settings.displayless)
          inputReader.wait(chalk_1.default.gray("Press any Key to continue..."));
        process.exit(21);
      }
    }
  });
}
exports.getCustomChannel = getCustomChannel;
function addanotherone() {
  return __awaiter(this, void 0, void 0, function* () {
    yield inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "Do you wanna add a new Custom Channel?"
      }
    ]).then((answers) => __awaiter(this, void 0, void 0, function* () {
      if (answers.confirmed) {
        yield createCustomChannel(false);
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("Found " + index_1.userdata.customchannel.length + " Custom Channels..."));
        winston_1.default.silly(" ");
      }
    }));
  });
}
function askCustomChannelStart(random, filterlive) {
  return __awaiter(this, void 0, void 0, function* () {
    index_1.userdata.availableDropNameChoices = [];
    index_1.userdata.customchannel.forEach((channel) => {
      if (filterlive) {
        if (channel.live) {
          index_1.userdata.availableDropNameChoices.push(channel.Name);
        }
      } else {
        index_1.userdata.availableDropNameChoices.push(channel.Name);
      }
    });
    if (index_1.userdata.availableDropNameChoices.length === 0) {
      winston_1.default.info(chalk_1.default.yellow("No Channels life select any to start..."));
      index_1.userdata.customchannel.forEach((channel) => {
        index_1.userdata.availableDropNameChoices.push(channel.Name);
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
        index_1.userdata.customchannel.forEach((drop) => {
          if (drop.Name === answer.namelist) {
            index_1.userdata.startDrop = drop.TTVLink.split("https://www.twitch.tv/")[1];
          }
        });
      }));
    } else {
      let randomname = index_1.userdata.availableDropNameChoices[(0, util_1.getRandomInt)(index_1.userdata.availableDropNameChoices.length)];
      index_1.userdata.customchannel.forEach((drop) => {
        if (drop.Name === randomname) {
          index_1.userdata.startDrop = drop.TTVLink.split("https://www.twitch.tv/")[1];
        }
      });
      winston_1.default.info(chalk_1.default.gray("Selected a random drop to watch: " + chalk_1.default.white(index_1.userdata.startDrop)));
    }
  });
}
exports.askCustomChannelStart = askCustomChannelStart;
function createCustomChannel(ask) {
  return __awaiter(this, void 0, void 0, function* () {
    if (ask) {
      yield inquirer.prompt([
        {
          type: "confirm",
          name: "confirmed",
          message: "Do you wanna add a Custom Channel?"
        }
      ]).then((answers) => __awaiter(this, void 0, void 0, function* () {
        if (!answers.confirmed) {
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("Closing Bot, No Custom Channels Added!"));
          if (!index_1.userdata.settings.displayless)
            inputReader.wait(chalk_1.default.gray("Press any Key to continue..."));
          process.exit(21);
        } else {
          yield getCustomDetails();
        }
      }));
    } else {
      yield getCustomDetails();
    }
  });
}
function getCustomDetails() {
  return __awaiter(this, void 0, void 0, function* () {
    let CustomChannel = {
      Name: "",
      TTVLink: "",
      WatchType: "",
      Time: 0,
      Points: false
    };
    const watch = ["Watch indefinitely", "Watch until time runs out"];
    yield inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Please provide a Name for this Custom Channel:"
      },
      {
        type: "input",
        name: "ttvlink",
        message: "Please provide the Twitch Url:",
        validate: (value) => (0, util_1.validURL)(value)
      },
      {
        type: "list",
        name: "watchoption",
        message: "How should the channel be watched?",
        choices: watch
      },
      {
        type: "confirm",
        name: "points",
        message: "Should the Bot also Farm Points?"
      }
    ]).then((answers) => __awaiter(this, void 0, void 0, function* () {
      winston_1.default.info(chalk_1.default.gray("Setting Name, link and the watch type..."));
      CustomChannel.Name = answers.name;
      CustomChannel.TTVLink = answers.ttvlink;
      CustomChannel.WatchType = answers.watchoption;
      CustomChannel.Points = answers.points;
      if (answers.watchoption === "Watch until time runs out") {
        yield inquirer.prompt([
          {
            type: "input",
            name: "time",
            message: "How many minutes should the channel be watched:"
          }
        ]).then((answers2) => __awaiter(this, void 0, void 0, function* () {
          winston_1.default.info(chalk_1.default.gray("Setting Time..."));
          CustomChannel.Time = answers2.time;
        }));
      }
      index_1.userdata.customchannel.push(CustomChannel);
      yield fs_1.default.promises.writeFile("./CustomChannels.json", JSON.stringify(index_1.userdata.customchannel, null, 2)).then(function() {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.green("Successfully Saved Custom Channels..."));
        winston_1.default.silly(" ");
      }).catch((err) => {
        throw err;
      });
    }));
  });
}
function customCheckLive(feedback) {
  return __awaiter(this, void 0, void 0, function* () {
    for (const customchannel of index_1.userdata.customchannel) {
      let channelLogin = customchannel.TTVLink.split("https://www.twitch.tv/")[1];
      let status = yield TwitchGQL.GetLiveStatus(channelLogin);
      customchannel["live"] = !!status;
      if (feedback) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.cyan(customchannel.TTVLink) + " | " + chalk_1.default.magenta(customchannel.Name) + " | " + (0, util_1.statustoString)(customchannel.live), { event: "getResult" });
      }
    }
    if (feedback)
      winston_1.default.silly(" ");
  });
}
exports.customCheckLive = customCheckLive;
//# sourceMappingURL=getCustomChannel.js.map
