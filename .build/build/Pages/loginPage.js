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
exports.Login = void 0;
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../index");
const winston = require("winston");
const fs = require("fs");
const inputReader = require("wait-console-input");
const puppeteer = require("puppeteer-core");
function Login() {
  return __awaiter(this, void 0, void 0, function* () {
    yield puppeteer.launch({ headless: false, executablePath: index_1.userdata.settings.Chromeexe, userDataDir: index_1.userdata.settings.UserDataPath, args: ["--no-sandbox"] }).then((browser) => __awaiter(this, void 0, void 0, function* () {
      const loginpage = yield browser.newPage();
      yield loginpage.setDefaultTimeout(0);
      if (index_1.userdata.settings.UserDataPath === "" && fs.existsSync("./twitch-session.json")) {
        let file = fs.readFileSync("./twitch-session.json", "utf8");
        let cokkies = yield JSON.parse(file);
        yield loginpage.setCookie.apply(loginpage, cokkies);
      }
      winston.silly(" ");
      winston.info(chalk_1.default.gray("Starting Login Page..."));
      yield loginpage.goto(index_1.userdata.loginpageurl, { waitUntil: "networkidle2" });
      yield loginpage.waitForNavigation().then(() => __awaiter(this, void 0, void 0, function* () {
        if (loginpage.url() !== "https://www.twitch.tv/?no-reload=true") {
          if (!index_1.userdata.settings.displayless)
            inputReader.wait(chalk_1.default.gray("Press any Key to continue..."));
          process.exit(22);
        }
        winston.silly(" ");
        winston.info(chalk_1.default.green("Success Login..."));
        winston.silly(" ");
        winston.info(chalk_1.default.gray("Saving Cookies..."));
        index_1.userdata.cookies = yield loginpage.cookies();
        yield fs.promises.writeFile("twitch-session.json", JSON.stringify(index_1.userdata.cookies, null, 2)).then(function() {
          winston.silly(" ");
          winston.info(chalk_1.default.green("Successfully Saved Cookies..."));
          winston.silly(" ");
        }).catch((err) => {
          throw err;
        });
      }));
      winston.silly(" ");
      winston.info(chalk_1.default.gray("Closing Browser and Moving on..."));
      yield browser.close();
    }));
  });
}
exports.Login = Login;
//# sourceMappingURL=loginPage.js.map
