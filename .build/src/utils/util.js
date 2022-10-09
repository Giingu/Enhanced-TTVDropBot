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
  claimedstatustoString: () => claimedstatustoString,
  delay: () => delay,
  getRandomInt: () => getRandomInt,
  livechresponse: () => livechresponse,
  minutestoPercent: () => minutestoPercent,
  retryConfig: () => retryConfig,
  statustoString: () => statustoString,
  validPath: () => validPath,
  validURL: () => validURL
});
var rax = __toModule(require("retry-axios"));
var import_winston = __toModule(require("winston"));
var import__ = __toModule(require("../index"));
const chalk = require("chalk");
const fs = require("fs");
function validPath(str) {
  if (fs.existsSync(str) && str.endsWith(".exe")) {
    return true;
  } else {
    return "Please provide a Valid Path...";
  }
}
function validURL(str) {
  if (str.startsWith("https://www.twitch.tv/")) {
    return true;
  } else {
    return "Please provide a Valid URL...";
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function statustoString(status) {
  if (!status) {
    return chalk.red("Offline");
  } else {
    return chalk.greenBright("Live");
  }
}
function claimedstatustoString(streamer) {
  return streamer ? chalk.greenBright.italic("Claimed") : chalk.red.italic("Unclaimed");
}
function livechresponse(foundlivechs) {
  if (foundlivechs.length >= 1) {
    return chalk.cyanBright(foundlivechs[0]);
  } else if (foundlivechs.length === 0) {
    return chalk.cyan("No Channel Live");
  }
}
function minutestoPercent(timewatched, maxtime) {
  let result = 100 / maxtime * timewatched;
  let resultr = Math.round((result + Number.EPSILON) * 100) / 100;
  return resultr;
}
async function delay(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
let retryConfig = {
  retry: 3,
  noResponseRetries: 3,
  retryDelay: import__.userdata.settings.RetryDelay,
  statusCodesToRetry: [[100, 199], [429, 429, 400], [500, 599]],
  httpMethodsToRetry: ["GET", "HEAD", "OPTIONS", "DELETE", "PUT", "POST"],
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err);
    import_winston.default.info(chalk.yellow("Failed axios Request... Retrying in " + Math.round(cfg?.retryDelay / 1e3 * 100) / 100 + " seconds... Try: " + cfg?.currentRetryAttempt + "/3 " + err), { event: "requestRetry" });
  },
  backoffType: "static"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  claimedstatustoString,
  delay,
  getRandomInt,
  livechresponse,
  minutestoPercent,
  retryConfig,
  statustoString,
  validPath,
  validURL
});
//# sourceMappingURL=util.js.map
