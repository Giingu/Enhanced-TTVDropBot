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
exports.login = void 0;
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../../index");
const getSettings_1 = require("../get/getSettings");
const loginPage_1 = require("../../Pages/loginPage");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../../utils/util");
const inquirer = require("inquirer");
let pw = "";
let nm = "";
function login() {
  return __awaiter(this, void 0, void 0, function* () {
    if (!index_1.userdata.auth_token && !fs_1.default.existsSync("./twitch-session.json")) {
      if (!index_1.userdata.settings.displayless) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.gray("Please Login into your Twitch Account..."));
        winston_1.default.silly(" ");
        let options = ["Directly via Command Line", "Via Browser"];
        yield inquirer.prompt([
          {
            type: "list",
            name: "loginoption",
            message: "How would you like to Login into your account?",
            choices: options
          }
        ]).then((answer) => __awaiter(this, void 0, void 0, function* () {
          if (answer.loginoption === "Via Browser") {
            yield browserlogin();
          } else {
            yield directlogin("", "");
            pw = "";
            nm = "";
          }
        }));
      } else {
        winston_1.default.error("ERROR");
        throw "No twitch-session.json found to use in displayless mode...";
      }
    } else {
      yield getTwitchUserDetails();
      winston_1.default.silly(" ");
      winston_1.default.info(chalk_1.default.gray("Found a twitch-session... No need to login..."));
      winston_1.default.silly(" ");
    }
  });
}
exports.login = login;
function askforacccountdetails() {
  return __awaiter(this, void 0, void 0, function* () {
    if (pw === "" || nm === "") {
      yield inquirer.prompt([
        {
          type: "input",
          name: "username",
          message: "What is your Username?"
        },
        {
          type: "password",
          name: "password",
          message: "What is your Password?"
        }
      ]).then((Answer) => __awaiter(this, void 0, void 0, function* () {
        pw = Answer.password;
        nm = Answer.username;
      }));
      return { pw, nm };
    }
    return { pw, nm };
  });
}
function askforauthcode(errorcode) {
  return __awaiter(this, void 0, void 0, function* () {
    let message = "";
    let input = "";
    if (errorcode === 3011)
      message = "What is your 2FA token?";
    if (errorcode === 3022)
      message = "What is your Email code?";
    yield inquirer.prompt([
      {
        type: "input",
        name: "code",
        message
      }
    ]).then((Answer) => __awaiter(this, void 0, void 0, function* () {
      input = Answer.code;
    }));
    return input;
  });
}
function directlogin(emailcode, facode, captcha_proof = {}) {
  return __awaiter(this, void 0, void 0, function* () {
    let attempt = 0;
    const details = yield askforacccountdetails();
    let config = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
        "Content-type": "text/plain"
      },
      raxConfig: util_1.retryConfig
    };
    let body = Object.assign({ "client_id": "kimne78kx3ncx6brgo4mv6wki5h1ko", "undelete_user": false, "remember_me": true, "username": details.nm, "password": details.pw }, captcha_proof);
    if (emailcode !== "") {
      Object.assign(body, { "twitchguard_code": emailcode });
    } else if (facode !== "") {
      Object.assign(body, { "authy_token": facode });
    }
    yield axios_1.default.post("https://passport.twitch.tv/login", body, config).then(function(response) {
      return __awaiter(this, void 0, void 0, function* () {
        let response_data = response.data;
        if (index_1.userdata.settings.debug)
          winston_1.default.info("loginresponse %o", JSON.stringify(response_data, null, 2));
        winston_1.default.info(chalk_1.default.green("Successfully Logged in..."));
        let authcookie = [{
          "name": "auth-token",
          "value": response_data.access_token
        }];
        yield fs_1.default.promises.writeFile("twitch-session.json", JSON.stringify(authcookie, null, 2)).then(function() {
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.green("Successfully Saved Cookies..."));
          winston_1.default.silly(" ");
        }).catch((err) => {
          throw err;
        });
        yield getTwitchUserDetails();
      });
    }).catch(function(error) {
      return __awaiter(this, void 0, void 0, function* () {
        winston_1.default.silly(" ");
        winston_1.default.error(chalk_1.default.yellow("Something went wrong..."));
        let errorcode = 0;
        let capta = {};
        try {
          if (error.response.data.captcha_proof)
            capta = { captcha_proof: error.response.data.captcha_proof };
        } catch (e) {
        }
        try {
          errorcode = error.response.data.error_code;
        } catch (e) {
        }
        if (attempt === 3) {
          winston_1.default.info(chalk_1.default.gray("Failed 3 times to login closing..."));
          throw "Failed to Login...";
        }
        if (errorcode === 1e3) {
          nm = "";
          pw = "";
          winston_1.default.info(chalk_1.default.gray("Login failed due to CAPTCHA..."));
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("Your login attempt was denied by CAPTCHA. Please wait 12h or login via the browser..."));
          winston_1.default.silly(" ");
          winston_1.default.info(chalk_1.default.gray("Redirecting to browser login..."));
          yield browserlogin();
        } else if (errorcode === 3001 || errorcode === 2005) {
          attempt++;
          nm = "";
          pw = "";
          winston_1.default.info(chalk_1.default.gray("Login failed due to incorrect username or password..."));
          yield directlogin("", "", capta);
        } else if (errorcode === 3012) {
          attempt++;
          winston_1.default.info(chalk_1.default.gray("Invaild 2FA..."));
          winston_1.default.silly(" ");
          let code = yield askforauthcode(3011);
          yield directlogin("", code, capta);
        } else if (errorcode === 3023) {
          attempt++;
          winston_1.default.info(chalk_1.default.gray("Invaild Email Code..."));
          winston_1.default.silly(" ");
          let code = yield askforauthcode(3022);
          yield directlogin("", code, capta);
        }
        if (errorcode === 3011) {
          winston_1.default.info(chalk_1.default.gray('2FA token required..."'));
          winston_1.default.silly(" ");
          let code = yield askforauthcode(3011);
          yield directlogin("", code, capta);
        } else if (errorcode === 3022) {
          winston_1.default.info(chalk_1.default.gray("Email code required..."));
          winston_1.default.silly(" ");
          let code = yield askforauthcode(3022);
          yield directlogin(code, "", capta);
        } else if (!fs_1.default.existsSync("./twitch-session.json")) {
          attempt++;
          nm = "";
          pw = "";
          winston_1.default.info(chalk_1.default.gray("Login failed for an unknown reason..."));
          winston_1.default.info(chalk_1.default.gray("The Reason is probably:"));
          winston_1.default.info(chalk_1.default.yellow("Error Code: " + error.data.error_code + " | Reason: " + error.data.error + " | Error Description: " + error.error_description));
          winston_1.default.silly(" ");
          yield directlogin("", "", capta);
        }
      });
    });
  });
}
function browserlogin() {
  return __awaiter(this, void 0, void 0, function* () {
    winston_1.default.info(chalk_1.default.gray("Proceeding to Browser..."));
    if (index_1.userdata.settings.Chromeexe === "") {
      winston_1.default.info(chalk_1.default.gray("No Browser Found..."));
      yield (0, getSettings_1.Chromepaths)();
      yield (0, loginPage_1.Login)();
      yield getTwitchUserDetails();
    } else {
      winston_1.default.info(chalk_1.default.gray("Browser Found..."));
      yield (0, loginPage_1.Login)();
      yield getTwitchUserDetails();
    }
  });
}
function getTwitchUserDetails() {
  return __awaiter(this, void 0, void 0, function* () {
    if (index_1.userdata.auth_token || fs_1.default.existsSync("./twitch-session.json")) {
      if (fs_1.default.existsSync("./twitch-session.json")) {
        const data = yield fs_1.default.promises.readFile("./twitch-session.json", "utf8");
        let cookiedata = JSON.parse(data);
        for (let i = 0; i < cookiedata.length; i++) {
          if (cookiedata[i].name === "auth-token") {
            index_1.userdata.auth_token = cookiedata[i].value;
            break;
          }
        }
      }
      if (index_1.userdata.auth_token === "") {
        winston_1.default.error("ERROR");
        throw "Could somehow not find a auth token in your twitch session...";
      }
    } else {
      winston_1.default.error("ERROR");
      throw "Could somehow not find a twitch session...";
    }
    let auth = "OAuth " + index_1.userdata.auth_token;
    let head = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
      Authorization: auth
    };
    yield axios_1.default.get("https://id.twitch.tv/oauth2/validate", { headers: head, raxConfig: util_1.retryConfig }).then(function(response) {
      let response_data = response.data;
      index_1.userdata.userid = response_data.user_id;
      index_1.userdata.clientid = response_data.client_id;
    }).catch(function(error) {
      winston_1.default.error(chalk_1.default.red("ERROR: Could not validate your auth token..."));
      throw error.response.status + " " + error.response.statusText + " " + error.response.data.message;
    });
  });
}
//# sourceMappingURL=defaultlogin.js.map
