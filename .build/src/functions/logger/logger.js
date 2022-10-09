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
  default: () => logger_default
});
var import_webHookHandler = __toModule(require("../handler/webHookHandler"));
var import__ = __toModule(require("../../index"));
const fs = require("fs");
const winston = require("winston");
const { format } = require("winston");
const { printf } = format;
async function logger_default() {
  const fileFormat = printf((log) => {
    return `${log.timestamp}: ${log.message}`;
  });
  const consoleFormat = printf((log) => {
    return log.message;
  });
  process.on("unhandledRejection", async (reason, promise) => {
    winston.error("Unhandled Rejection at: %o", promise);
    winston.error("Unhandled Rejection Reason: " + reason);
    if (import__.userdata.settings.WebHookURL !== "") {
      await (0, import_webHookHandler.sendWebhook)([reason, "More Details can be found in the error Log...", "Closing Bot..."], "ERROR", import__.userdata.settings.WebHookURL, 16711680).then((request) => {
        if (!request) {
          winston.info("Could not send Webhook with ERROR: Closing Bot...");
          process.exit(21);
        } else {
          process.exit(21);
        }
      });
    } else {
      process.exit(21);
    }
  });
  try {
    await createConsoleLogger(consoleFormat);
    if (fs.existsSync("./settings.json")) {
      let settingsfile = fs.readFileSync("./settings.json", "utf8");
      let options = await JSON.parse(settingsfile);
      if (options.LogToFile) {
        await createFilelogger(fileFormat);
      }
    }
  } catch (e) {
    await createConsoleLogger(consoleFormat);
    await createFilelogger(fileFormat);
    winston.error("ERROR");
    throw "Invalid/Corrupted JSON file...";
  }
  return true;
}
async function createConsoleLogger(consoleFormat) {
  const consoleLogger = new winston.transports.Console({
    level: "silly",
    handleExceptions: true,
    RejectionHandler: true,
    format: format.combine(format.prettyPrint(), format.splat(), consoleFormat)
  });
  winston.add(consoleLogger);
  consoleLogger.on("logged", async function(log) {
    if (import__.userdata.settings.WebHookURL !== "")
      await (0, import_webHookHandler.webhookHandler)(log);
  });
}
async function createFilelogger(fileFormat) {
  winston.add(new winston.transports.File({
    filename: "./logs/TTVDropBot-out.log",
    level: "info",
    handleExceptions: true,
    RejectionHandler: true,
    maxsize: "20m",
    maxFiles: 5,
    timestamp: true,
    format: format.combine(format.uncolorize(), format.splat(), format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), fileFormat)
  }));
  winston.add(new winston.transports.File({
    filename: "./logs/TTVDropBot-error.log",
    level: "error",
    handleExceptions: true,
    RejectionHandler: true,
    maxsize: "20m",
    maxFiles: 5,
    timestamp: true,
    format: format.combine(format.uncolorize(), format.splat(), format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), fileFormat)
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=logger.js.map
