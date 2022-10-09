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
exports.Chromepaths = exports.logimportantvalues = void 0;
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../../index");
const util_1 = require("../../utils/util");
const logger_1 = __importDefault(require("../logger/logger"));
const fs = require("fs");
const winston = require("winston");
const chromePaths = require("chrome-paths");
const inquirer = require("inquirer");
const inputReader = require("wait-console-input");
const path = "./settings.json";
const opsys = process.platform;
function default_1() {
  return __awaiter(this, void 0, void 0, function* () {
    if (fs.existsSync(path)) {
      yield fs.promises.readFile("./settings.json", "utf8").then((settingsfile) => __awaiter(this, void 0, void 0, function* () {
        index_1.userdata.settings = yield JSON.parse(settingsfile);
        yield (0, logger_1.default)();
      }));
      winston.silly(" ");
      winston.info(chalk_1.default.green("Successfully Loaded Settings..."));
      winston.silly(" ");
      if (index_1.userdata.settings.displayless && index_1.userdata.settings.Prioritylist.length === 0) {
        winston.warn(chalk_1.default.yellow("Warning: Please add Games to your Priorty List, otherwise the bot will select a random game..."));
      }
      return index_1.userdata.settings;
    } else {
      yield (0, logger_1.default)();
      yield fs.promises.writeFile("settings.json", JSON.stringify(index_1.userdata.settings, null, 2)).then(function() {
        winston.silly(" ");
        winston.info(chalk_1.default.green("Successfully Created Settings..."));
        winston.silly(" ");
      }).catch((err) => {
        throw err;
      });
      return index_1.userdata.settings;
    }
  });
}
exports.default = default_1;
function logimportantvalues() {
  return __awaiter(this, void 0, void 0, function* () {
    if (index_1.userdata.settings.debug) {
      winston.info(chalk_1.default.cyan("Debug enabled"));
    }
    if (index_1.userdata.settings.displayless) {
      winston.info(chalk_1.default.cyan("Displayless mode enabled"));
    }
    if (index_1.userdata.settings.WebHookURL !== "") {
      winston.info(chalk_1.default.cyan("Discord Webhook enabled"));
    }
  });
}
exports.logimportantvalues = logimportantvalues;
function Chromepaths() {
  return __awaiter(this, void 0, void 0, function* () {
    yield inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "Found it! Is this your Google Chrome Path? | " + chalk_1.default.cyan(chromePaths.chrome)
      }
    ]).then((Answer) => __awaiter(this, void 0, void 0, function* () {
      if (Answer.confirmed) {
        if (opsys !== "linux") {
          if (fs.existsSync(chromePaths.chrome)) {
            winston.silly(" ");
            index_1.userdata.settings.Chromeexe = yield chromePaths.chrome;
          } else {
            winston.silly(" ");
            winston.error(chalk_1.default.red("Invalid Path... Please restart the Bot and provide a new one manually..."));
            winston.silly(" ");
            if (!index_1.userdata.settings.displayless)
              inputReader.wait(chalk_1.default.gray("Press any Key to continue..."));
            process.exit(21);
          }
        } else {
          winston.silly(" ");
          index_1.userdata.settings.Chromeexe = yield chromePaths.chrome;
        }
      } else {
        winston.silly(" ");
        yield inquirer.prompt([
          {
            type: "input",
            name: "pathexe",
            message: "Please provide your Google Chrome Executable path?",
            validate: (value) => (0, util_1.validPath)(value)
          }
        ]).then((Answer2) => __awaiter(this, void 0, void 0, function* () {
          winston.silly(" ");
          winston.info(chalk_1.default.gray("Setting Executable Path..."));
          index_1.userdata.settings.Chromeexe = Answer2.pathexe;
        }));
      }
    }));
    yield fs.promises.writeFile("settings.json", JSON.stringify(index_1.userdata.settings, null, 2)).then(function() {
      winston.silly(" ");
      winston.info(chalk_1.default.green("Successfully Saved Settings..."));
      winston.silly(" ");
    }).catch((err) => {
      throw err;
    });
  });
}
exports.Chromepaths = Chromepaths;
//# sourceMappingURL=getSettings.js.map
