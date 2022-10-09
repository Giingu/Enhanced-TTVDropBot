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
  askCustomChannelStart: () => askCustomChannelStart,
  customCheckLive: () => customCheckLive,
  getCustomChannel: () => getCustomChannel
});
var import_fs = __toModule(require("fs"));
var import__ = __toModule(require("../../index"));
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_util = __toModule(require("../../utils/util"));
const inputReader = require("wait-console-input");
const inquirer = require("inquirer");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
async function getCustomChannel() {
  const path = "./CustomChannels.json";
  if (!import__.userdata.settings.displayless) {
    if (import_fs.default.existsSync(path)) {
      let customch = import_fs.default.readFileSync("./CustomChannels.json", "utf8");
      import__.userdata.customchannel = JSON.parse(customch);
      if (import__.userdata.customchannel.length === 0) {
        import_winston.default.silly(" ");
        import_winston.default.info(import_chalk.default.gray("No Custom Channels Found..."));
        await createCustomChannel(true);
      }
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Found " + import__.userdata.customchannel.length + " Custom Channels..."));
      import_winston.default.silly(" ");
      await addanotherone();
      await customCheckLive(true);
      await askCustomChannelStart(false, true);
    } else {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("No Custom Channels Found..."));
      await createCustomChannel(false);
      if (import__.userdata.customchannel.length === 0) {
        import_winston.default.silly(" ");
        import_winston.default.info(import_chalk.default.gray("No Custom Channels Created..."));
        import_winston.default.silly(" ");
        import_winston.default.info(import_chalk.default.gray("Closing Bot, No Custom Channels Added!"));
        if (!import__.userdata.settings.displayless)
          inputReader.wait(import_chalk.default.gray("Press any Key to continue..."));
        process.exit(21);
      }
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Found " + import__.userdata.customchannel.length + " Custom Channels..."));
      import_winston.default.silly(" ");
      await addanotherone();
      await customCheckLive(true);
      await askCustomChannelStart(false, true);
    }
  } else {
    const path2 = "./CustomChannels.json";
    if (import_fs.default.existsSync(path2)) {
      let customch = import_fs.default.readFileSync("./CustomChannels.json", "utf8");
      import__.userdata.customchannel = JSON.parse(customch);
      if (import__.userdata.customchannel.length === 0) {
        import_winston.default.silly(" ");
        import_winston.default.info(import_chalk.default.gray("No Custom Channels Found..."));
        process.exit(1);
      }
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Found " + import__.userdata.customchannel.length + " Custom Channels..."));
      import_winston.default.silly(" ");
      await customCheckLive(true);
      await askCustomChannelStart(true, true);
    } else {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Closing Bot, somehow there is no Customchannels file anymore...!"));
      if (!import__.userdata.settings.displayless)
        inputReader.wait(import_chalk.default.gray("Press any Key to continue..."));
      process.exit(21);
    }
  }
}
async function addanotherone() {
  await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Do you wanna add a new Custom Channel?"
    }
  ]).then(async (answers) => {
    if (answers.confirmed) {
      await createCustomChannel(false);
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Found " + import__.userdata.customchannel.length + " Custom Channels..."));
      import_winston.default.silly(" ");
    }
  });
}
async function askCustomChannelStart(random, filterlive) {
  import__.userdata.availableDropNameChoices = [];
  import__.userdata.customchannel.forEach((channel) => {
    if (filterlive) {
      if (channel.live) {
        import__.userdata.availableDropNameChoices.push(channel.Name);
      }
    } else {
      import__.userdata.availableDropNameChoices.push(channel.Name);
    }
  });
  if (import__.userdata.availableDropNameChoices.length === 0) {
    import_winston.default.info(import_chalk.default.yellow("No Channels life select any to start..."));
    import__.userdata.customchannel.forEach((channel) => {
      import__.userdata.availableDropNameChoices.push(channel.Name);
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
      import__.userdata.customchannel.forEach((drop) => {
        if (drop.Name === answer.namelist) {
          import__.userdata.startDrop = drop.TTVLink.split("https://www.twitch.tv/")[1];
        }
      });
    });
  } else {
    let randomname = import__.userdata.availableDropNameChoices[(0, import_util.getRandomInt)(import__.userdata.availableDropNameChoices.length)];
    import__.userdata.customchannel.forEach((drop) => {
      if (drop.Name === randomname) {
        import__.userdata.startDrop = drop.TTVLink.split("https://www.twitch.tv/")[1];
      }
    });
    import_winston.default.info(import_chalk.default.gray("Selected a random drop to watch: " + import_chalk.default.white(import__.userdata.startDrop)));
  }
}
async function createCustomChannel(ask) {
  if (ask) {
    await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "Do you wanna add a Custom Channel?"
      }
    ]).then(async (answers) => {
      if (!answers.confirmed) {
        import_winston.default.silly(" ");
        import_winston.default.info(import_chalk.default.gray("Closing Bot, No Custom Channels Added!"));
        if (!import__.userdata.settings.displayless)
          inputReader.wait(import_chalk.default.gray("Press any Key to continue..."));
        process.exit(21);
      } else {
        await getCustomDetails();
      }
    });
  } else {
    await getCustomDetails();
  }
}
async function getCustomDetails() {
  let CustomChannel = {
    Name: "",
    TTVLink: "",
    WatchType: "",
    Time: 0,
    Points: false
  };
  const watch = ["Watch indefinitely", "Watch until time runs out"];
  await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Please provide a Name for this Custom Channel:"
    },
    {
      type: "input",
      name: "ttvlink",
      message: "Please provide the Twitch Url:",
      validate: (value) => (0, import_util.validURL)(value)
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
  ]).then(async (answers) => {
    import_winston.default.info(import_chalk.default.gray("Setting Name, link and the watch type..."));
    CustomChannel.Name = answers.name;
    CustomChannel.TTVLink = answers.ttvlink;
    CustomChannel.WatchType = answers.watchoption;
    CustomChannel.Points = answers.points;
    if (answers.watchoption === "Watch until time runs out") {
      await inquirer.prompt([
        {
          type: "input",
          name: "time",
          message: "How many minutes should the channel be watched:"
        }
      ]).then(async (answers2) => {
        import_winston.default.info(import_chalk.default.gray("Setting Time..."));
        CustomChannel.Time = answers2.time;
      });
    }
    import__.userdata.customchannel.push(CustomChannel);
    await import_fs.default.promises.writeFile("./CustomChannels.json", JSON.stringify(import__.userdata.customchannel, null, 2)).then(function() {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("Successfully Saved Custom Channels..."));
      import_winston.default.silly(" ");
    }).catch((err) => {
      throw err;
    });
  });
}
async function customCheckLive(feedback) {
  for (const customchannel of import__.userdata.customchannel) {
    let channelLogin = customchannel.TTVLink.split("https://www.twitch.tv/")[1];
    let status = await TwitchGQL.GetLiveStatus(channelLogin);
    customchannel["live"] = !!status;
    if (feedback) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.cyan(customchannel.TTVLink) + " | " + import_chalk.default.magenta(customchannel.Name) + " | " + (0, import_util.statustoString)(customchannel.live), { event: "getResult" });
    }
  }
  if (feedback)
    import_winston.default.silly(" ");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  askCustomChannelStart,
  customCheckLive,
  getCustomChannel
});
//# sourceMappingURL=getCustomChannel.js.map
