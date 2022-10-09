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
  Chromepaths: () => Chromepaths,
  default: () => getSettings_default,
  logimportantvalues: () => logimportantvalues
});
var import_chalk = __toModule(require("chalk"));
var import__ = __toModule(require("../../index"));
var import_util = __toModule(require("../../utils/util"));
var import_logger = __toModule(require("../logger/logger"));
const fs = require("fs");
const winston = require("winston");
const chromePaths = require("chrome-paths");
const inquirer = require("inquirer");
const inputReader = require("wait-console-input");
const path = "./settings.json";
const opsys = process.platform;
async function getSettings_default() {
  if (fs.existsSync(path)) {
    await fs.promises.readFile("./settings.json", "utf8").then(async (settingsfile) => {
      import__.userdata.settings = await JSON.parse(settingsfile);
      await (0, import_logger.default)();
    });
    winston.silly(" ");
    winston.info(import_chalk.default.green("Successfully Loaded Settings..."));
    winston.silly(" ");
    if (import__.userdata.settings.displayless && import__.userdata.settings.Prioritylist.length === 0) {
      winston.warn(import_chalk.default.yellow("Warning: Please add Games to your Priorty List, otherwise the bot will select a random game..."));
    }
    return import__.userdata.settings;
  } else {
    await (0, import_logger.default)();
    await fs.promises.writeFile("settings.json", JSON.stringify(import__.userdata.settings, null, 2)).then(function() {
      winston.silly(" ");
      winston.info(import_chalk.default.green("Successfully Created Settings..."));
      winston.silly(" ");
    }).catch((err) => {
      throw err;
    });
    return import__.userdata.settings;
  }
}
async function logimportantvalues() {
  if (import__.userdata.settings.debug) {
    winston.info(import_chalk.default.cyan("Debug enabled"));
  }
  if (import__.userdata.settings.displayless) {
    winston.info(import_chalk.default.cyan("Displayless mode enabled"));
  }
  if (import__.userdata.settings.WebHookURL !== "") {
    winston.info(import_chalk.default.cyan("Discord Webhook enabled"));
  }
}
async function Chromepaths() {
  await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Found it! Is this your Google Chrome Path? | " + import_chalk.default.cyan(chromePaths.chrome)
    }
  ]).then(async (Answer) => {
    if (Answer.confirmed) {
      if (opsys !== "linux") {
        if (fs.existsSync(chromePaths.chrome)) {
          winston.silly(" ");
          import__.userdata.settings.Chromeexe = await chromePaths.chrome;
        } else {
          winston.silly(" ");
          winston.error(import_chalk.default.red("Invalid Path... Please restart the Bot and provide a new one manually..."));
          winston.silly(" ");
          if (!import__.userdata.settings.displayless)
            inputReader.wait(import_chalk.default.gray("Press any Key to continue..."));
          process.exit(21);
        }
      } else {
        winston.silly(" ");
        import__.userdata.settings.Chromeexe = await chromePaths.chrome;
      }
    } else {
      winston.silly(" ");
      await inquirer.prompt([
        {
          type: "input",
          name: "pathexe",
          message: "Please provide your Google Chrome Executable path?",
          validate: (value) => (0, import_util.validPath)(value)
        }
      ]).then(async (Answer2) => {
        winston.silly(" ");
        winston.info(import_chalk.default.gray("Setting Executable Path..."));
        import__.userdata.settings.Chromeexe = Answer2.pathexe;
      });
    }
  });
  await fs.promises.writeFile("settings.json", JSON.stringify(import__.userdata.settings, null, 2)).then(function() {
    winston.silly(" ");
    winston.info(import_chalk.default.green("Successfully Saved Settings..."));
    winston.silly(" ");
  }).catch((err) => {
    throw err;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chromepaths,
  logimportantvalues
});
//# sourceMappingURL=getSettings.js.map
