var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
  login: () => login
});
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import__ = __toModule(require("../../index"));
var import_getSettings = __toModule(require("../get/getSettings"));
var import_loginPage = __toModule(require("../../Pages/loginPage"));
var import_fs = __toModule(require("fs"));
var import_axios = __toModule(require("axios"));
var import_util = __toModule(require("../../utils/util"));
const inquirer = require("inquirer");
let pw = "";
let nm = "";
async function login() {
  if (!import__.userdata.auth_token && !import_fs.default.existsSync("./twitch-session.json")) {
    if (!import__.userdata.settings.displayless) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Please Login into your Twitch Account..."));
      import_winston.default.silly(" ");
      let options = ["Directly via Command Line", "Via Browser"];
      await inquirer.prompt([
        {
          type: "list",
          name: "loginoption",
          message: "How would you like to Login into your account?",
          choices: options
        }
      ]).then(async (answer) => {
        if (answer.loginoption === "Via Browser") {
          await browserlogin();
        } else {
          await directlogin("", "");
          pw = "";
          nm = "";
        }
      });
    } else {
      import_winston.default.error("ERROR");
      throw "No twitch-session.json found to use in displayless mode...";
    }
  } else {
    await getTwitchUserDetails();
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("Found a twitch-session... No need to login..."));
    import_winston.default.silly(" ");
  }
}
async function askforacccountdetails() {
  if (pw === "" || nm === "") {
    await inquirer.prompt([
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
    ]).then(async (Answer) => {
      pw = Answer.password;
      nm = Answer.username;
    });
    return { pw, nm };
  }
  return { pw, nm };
}
async function askforauthcode(errorcode) {
  let message = "";
  let input = "";
  if (errorcode === 3011)
    message = "What is your 2FA token?";
  if (errorcode === 3022)
    message = "What is your Email code?";
  await inquirer.prompt([
    {
      type: "input",
      name: "code",
      message
    }
  ]).then(async (Answer) => {
    input = Answer.code;
  });
  return input;
}
async function directlogin(emailcode, facode, captcha_proof = {}) {
  let attempt = 0;
  const details = await askforacccountdetails();
  let config = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
      "Content-type": "text/plain"
    },
    raxConfig: import_util.retryConfig
  };
  let body = __spreadValues({
    "client_id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    "undelete_user": false,
    "remember_me": true,
    "username": details.nm,
    "password": details.pw
  }, captcha_proof);
  if (emailcode !== "") {
    Object.assign(body, { "twitchguard_code": emailcode });
  } else if (facode !== "") {
    Object.assign(body, { "authy_token": facode });
  }
  await import_axios.default.post("https://passport.twitch.tv/login", body, config).then(async function(response) {
    let response_data = response.data;
    if (import__.userdata.settings.debug)
      import_winston.default.info("loginresponse %o", JSON.stringify(response_data, null, 2));
    import_winston.default.info(import_chalk.default.green("Successfully Logged in..."));
    let authcookie = [{
      "name": "auth-token",
      "value": response_data.access_token
    }];
    await import_fs.default.promises.writeFile("twitch-session.json", JSON.stringify(authcookie, null, 2)).then(function() {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.green("Successfully Saved Cookies..."));
      import_winston.default.silly(" ");
    }).catch((err) => {
      throw err;
    });
    await getTwitchUserDetails();
  }).catch(async function(error) {
    import_winston.default.silly(" ");
    import_winston.default.error(import_chalk.default.yellow("Something went wrong..."));
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
      import_winston.default.info(import_chalk.default.gray("Failed 3 times to login closing..."));
      throw "Failed to Login...";
    }
    if (errorcode === 1e3) {
      nm = "";
      pw = "";
      import_winston.default.info(import_chalk.default.gray("Login failed due to CAPTCHA..."));
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Your login attempt was denied by CAPTCHA. Please wait 12h or login via the browser..."));
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.gray("Redirecting to browser login..."));
      await browserlogin();
    } else if (errorcode === 3001 || errorcode === 2005) {
      attempt++;
      nm = "";
      pw = "";
      import_winston.default.info(import_chalk.default.gray("Login failed due to incorrect username or password..."));
      await directlogin("", "", capta);
    } else if (errorcode === 3012) {
      attempt++;
      import_winston.default.info(import_chalk.default.gray("Invaild 2FA..."));
      import_winston.default.silly(" ");
      let code = await askforauthcode(3011);
      await directlogin("", code, capta);
    } else if (errorcode === 3023) {
      attempt++;
      import_winston.default.info(import_chalk.default.gray("Invaild Email Code..."));
      import_winston.default.silly(" ");
      let code = await askforauthcode(3022);
      await directlogin("", code, capta);
    }
    if (errorcode === 3011) {
      import_winston.default.info(import_chalk.default.gray('2FA token required..."'));
      import_winston.default.silly(" ");
      let code = await askforauthcode(3011);
      await directlogin("", code, capta);
    } else if (errorcode === 3022) {
      import_winston.default.info(import_chalk.default.gray("Email code required..."));
      import_winston.default.silly(" ");
      let code = await askforauthcode(3022);
      await directlogin(code, "", capta);
    } else if (!import_fs.default.existsSync("./twitch-session.json")) {
      attempt++;
      nm = "";
      pw = "";
      import_winston.default.info(import_chalk.default.gray("Login failed for an unknown reason..."));
      import_winston.default.info(import_chalk.default.gray("The Reason is probably:"));
      import_winston.default.info(import_chalk.default.yellow("Error Code: " + error.data.error_code + " | Reason: " + error.data.error + " | Error Description: " + error.error_description));
      import_winston.default.silly(" ");
      await directlogin("", "", capta);
    }
  });
}
async function browserlogin() {
  import_winston.default.info(import_chalk.default.gray("Proceeding to Browser..."));
  if (import__.userdata.settings.Chromeexe === "") {
    import_winston.default.info(import_chalk.default.gray("No Browser Found..."));
    await (0, import_getSettings.Chromepaths)();
    await (0, import_loginPage.Login)();
    await getTwitchUserDetails();
  } else {
    import_winston.default.info(import_chalk.default.gray("Browser Found..."));
    await (0, import_loginPage.Login)();
    await getTwitchUserDetails();
  }
}
async function getTwitchUserDetails() {
  if (import__.userdata.auth_token || import_fs.default.existsSync("./twitch-session.json")) {
    if (import_fs.default.existsSync("./twitch-session.json")) {
      const data = await import_fs.default.promises.readFile("./twitch-session.json", "utf8");
      let cookiedata = JSON.parse(data);
      for (let i = 0; i < cookiedata.length; i++) {
        if (cookiedata[i].name === "auth-token") {
          import__.userdata.auth_token = cookiedata[i].value;
          break;
        }
      }
    }
    if (import__.userdata.auth_token === "") {
      import_winston.default.error("ERROR");
      throw "Could somehow not find a auth token in your twitch session...";
    }
  } else {
    import_winston.default.error("ERROR");
    throw "Could somehow not find a twitch session...";
  }
  let auth = "OAuth " + import__.userdata.auth_token;
  let head = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
    Authorization: auth
  };
  await import_axios.default.get("https://id.twitch.tv/oauth2/validate", { headers: head, raxConfig: import_util.retryConfig }).then(function(response) {
    let response_data = response.data;
    import__.userdata.userid = response_data.user_id;
    import__.userdata.clientid = response_data.client_id;
  }).catch(function(error) {
    import_winston.default.error(import_chalk.default.red("ERROR: Could not validate your auth token..."));
    throw error.response.status + " " + error.response.statusText + " " + error.response.data.message;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  login
});
//# sourceMappingURL=defaultlogin.js.map
