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
exports.matchArgs = exports.setArgs = void 0;
const index_1 = require("../../index");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const index_2 = require("../../index");
function setArgs() {
  return __awaiter(this, void 0, void 0, function* () {
    yield (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).scriptName("./TTVDropBot or index.js").usage("Usage: $0 --arg...").version(index_1.version).option("chrome", {
      alias: "c",
      describe: "The path to your Chrome executable.",
      type: "string",
      nargs: 1
    }).example("--chrome C:path:to:chrome.exe", "Sets your chrome path.").option("userdata", {
      alias: "u",
      describe: "The path to your userdata folder location.",
      type: "string",
      nargs: 1
    }).example("--userdata C:path:to:userdata-folder", "Sets your userdata path.").option("webhook", {
      alias: "wh",
      describe: "The Discord Webhook URL.",
      type: "string",
      nargs: 1
    }).example("--webhook https:discord.com:api:webh....", "Sets your webhook url.").option("webhookevents", {
      describe: "Set what events should be send via webhook.",
      type: "array"
    }).example("--webhookevents requestretry claim newdrop offline newgame get getresult progress start error warn info", "Defaults to the events in this example provided.").option("interval", {
      alias: "i",
      describe: "The progress interval in ms.",
      type: "number",
      nargs: 1
    }).example("--interval 30000", "Sets the progress interval to 30s.").option("retryinterval", {
      alias: "retry",
      describe: "The retry interval in ms.",
      type: "number",
      nargs: 1
    }).example("--retryinterval 30000", "Sets the retry interval to 30s.").option("games", {
      alias: "g",
      describe: "The Games the bot should watch.",
      type: "array"
    }).example("--games Rust Krunker 'Elite: Dangerous' ", "Sets the Prioritylist to Rust, Krunker and Elite: Dangerous.").option("token", {
      describe: "Your twitch auth_token.",
      type: "string"
    }).example("--token yourkindalongtoken ", "Sets the your current twitch auth token, overwriting any in twitch-session.json.").option("showtoken", {
      describe: "Show your auth_token after login.",
      type: "boolean",
      nargs: 0
    }).option("debug", {
      alias: "d",
      describe: "Enable Debug logging.",
      type: "boolean",
      nargs: 0
    }).option("displayless", {
      alias: "dl",
      describe: "Enable Displayless mode.",
      type: "boolean",
      nargs: 0
    }).option("forcecustomchannel", {
      describe: "Force Custom Channels. Only useful for display-less mode.",
      type: "boolean",
      nargs: 0
    }).option("waitforchannels", {
      alias: "waitonline",
      describe: "Disable waitforchannels, forcing the bot to not wait for other channels with drops instead switch the game.",
      type: "boolean",
      nargs: 0
    }).option("autoclaim", {
      describe: "Enable autoclaim for drops.",
      type: "boolean",
      nargs: 0
    }).option("autopoints", {
      describe: "Enable auto points for channels.",
      type: "boolean",
      nargs: 0
    }).option("log", {
      describe: "Enable logging to file.",
      type: "boolean",
      nargs: 0
    }).option("usekeepalive", {
      describe: "Enable Express KeepAlive.",
      type: "boolean",
      nargs: 0
    }).option("tray", {
      describe: "Start app in the tray.",
      type: "boolean",
      nargs: 0
    }).describe("help", "Show help.").describe("version", "Show version number.").epilog("TTVDropBot made possible by Zarg");
  });
}
exports.setArgs = setArgs;
function matchArgs() {
  return __awaiter(this, void 0, void 0, function* () {
    const args = yargs_1.default.argv;
    if (args.chrome !== void 0)
      index_2.userdata.settings.Chromeexe = args.chrome;
    if (args.userdata !== void 0)
      index_2.userdata.settings.UserDataPath = args.userdata;
    if (args.webhook !== void 0)
      index_2.userdata.settings.WebHookURL = args.webhook;
    if (args.interval !== void 0)
      index_2.userdata.settings.ProgressCheckInterval = args.interval;
    if (args.games !== void 0)
      index_2.userdata.settings.Prioritylist = args.games;
    if (args.debug !== void 0)
      index_2.userdata.settings.debug = args.debug;
    if (args.displayless !== void 0)
      index_2.userdata.settings.displayless = args.displayless;
    if (args.forcecustomchannel !== void 0)
      index_2.userdata.settings.ForceCustomChannel = args.forcecustomchannel;
    if (args.waitforchannels !== void 0)
      index_2.userdata.settings.WaitforChannels = args.waitforchannels;
    if (args.autoclaim !== void 0)
      index_2.userdata.settings.AutoClaim = args.autoclaim;
    if (args.autopoints !== void 0)
      index_2.userdata.settings.AutoPoints = args.autopoints;
    if (args.log !== void 0)
      index_2.userdata.settings.LogToFile = args.log;
    if (args.usekeepalive !== void 0)
      index_2.userdata.settings.UseKeepAlive = args.usekeepalive;
    if (args.retryinterval !== void 0)
      index_2.userdata.settings.RetryDelay = args.retryinterval;
    if (args.webhookevents !== void 0)
      index_2.userdata.settings.WebHookEvents = args.webhookevents;
    if (args.showtoken !== void 0)
      index_2.userdata.showtoken = args.showtoken;
    if (args.token !== void 0)
      index_2.userdata.auth_token = args.token;
    if (process.env.ttvdropbot_chrome !== void 0)
      index_2.userdata.settings.Chromeexe = process.env.ttvdropbot_chrome;
    if (process.env.ttvdropbot_userdata !== void 0)
      index_2.userdata.settings.UserDataPath = process.env.ttvdropbot_userdata;
    if (process.env.ttvdropbot_webhook !== void 0)
      index_2.userdata.settings.WebHookURL = process.env.ttvdropbot_webhook;
    if (process.env.ttvdropbot_interval !== void 0)
      index_2.userdata.settings.ProgressCheckInterval = parseInt(process.env.ttvdropbot_interval);
    if (process.env.ttvdropbot_games !== void 0) {
      let stringarray = process.env.ttvdropbot_games.split(" ");
      let replacedarray = stringarray.map((game) => game.replace(/_/g, " "));
      index_2.userdata.settings.Prioritylist = replacedarray;
    }
    if (process.env.ttvdropbot_forcecustomchannel !== void 0)
      index_2.userdata.settings.ForceCustomChannel = JSON.parse(process.env.ttvdropbot_forcecustomchannel);
    if (process.env.ttvdropbot_debug !== void 0)
      index_2.userdata.settings.debug = JSON.parse(process.env.ttvdropbot_debug);
    if (process.env.ttvdropbot_displayless !== void 0)
      index_2.userdata.settings.displayless = JSON.parse(process.env.ttvdropbot_displayless);
    if (process.env.ttvdropbot_waitforchannels !== void 0)
      index_2.userdata.settings.WaitforChannels = JSON.parse(process.env.ttvdropbot_waitforchannels);
    if (process.env.ttvdropbot_autoclaim !== void 0)
      index_2.userdata.settings.AutoClaim = JSON.parse(process.env.ttvdropbot_autoclaim);
    if (process.env.ttvdropbot_autopoints !== void 0)
      index_2.userdata.settings.AutoPoints = JSON.parse(process.env.ttvdropbot_autopoints);
    if (process.env.ttvdropbot_log !== void 0)
      index_2.userdata.settings.LogToFile = JSON.parse(process.env.ttvdropbot_log);
    if (process.env.ttvdropbot_usekeepalive !== void 0)
      index_2.userdata.settings.UseKeepAlive = JSON.parse(process.env.ttvdropbot_usekeepalive);
    if (process.env.ttvdropbot_retryinterval !== void 0)
      index_2.userdata.settings.RetryDelay = parseInt(process.env.ttvdropbot_retryinterval);
    if (process.env.ttvdropbot_webhookevents !== void 0)
      index_2.userdata.settings.WebHookEvents = process.env.ttvdropbot_webhookevents.split(" ");
    if (process.env.ttvdropbot_showtoken !== void 0)
      index_2.userdata.showtoken = JSON.parse(process.env.ttvdropbot_showtoken);
    if (process.env.ttvdropbot_token !== void 0)
      index_2.userdata.auth_token = process.env.ttvdropbot_token;
  });
}
exports.matchArgs = matchArgs;
//# sourceMappingURL=getArgs.js.map
