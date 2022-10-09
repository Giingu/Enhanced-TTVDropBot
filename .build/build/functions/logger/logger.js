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
Object.defineProperty(exports, "__esModule", { value: true });
const webHookHandler_1 = require("../handler/webHookHandler");
const index_1 = require("../../index");
const fs = require("fs");
const winston = require("winston");
const { format } = require("winston");
const { printf } = format;
function default_1() {
  return __awaiter(this, void 0, void 0, function* () {
    const fileFormat = printf((log) => {
      return `${log.timestamp}: ${log.message}`;
    });
    const consoleFormat = printf((log) => {
      return log.message;
    });
    process.on("unhandledRejection", (reason, promise) => __awaiter(this, void 0, void 0, function* () {
      winston.error("Unhandled Rejection at: %o", promise);
      winston.error("Unhandled Rejection Reason: " + reason);
      if (index_1.userdata.settings.WebHookURL !== "") {
        yield (0, webHookHandler_1.sendWebhook)([reason, "More Details can be found in the error Log...", "Closing Bot..."], "ERROR", index_1.userdata.settings.WebHookURL, 16711680).then((request) => {
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
    }));
    try {
      yield createConsoleLogger(consoleFormat);
      if (fs.existsSync("./settings.json")) {
        let settingsfile = fs.readFileSync("./settings.json", "utf8");
        let options = yield JSON.parse(settingsfile);
        if (options.LogToFile) {
          yield createFilelogger(fileFormat);
        }
      }
    } catch (e) {
      yield createConsoleLogger(consoleFormat);
      yield createFilelogger(fileFormat);
      winston.error("ERROR");
      throw "Invalid/Corrupted JSON file...";
    }
    return true;
  });
}
exports.default = default_1;
function createConsoleLogger(consoleFormat) {
  return __awaiter(this, void 0, void 0, function* () {
    const consoleLogger = new winston.transports.Console({
      level: "silly",
      handleExceptions: true,
      RejectionHandler: true,
      format: format.combine(format.prettyPrint(), format.splat(), consoleFormat)
    });
    winston.add(consoleLogger);
    consoleLogger.on("logged", function(log) {
      return __awaiter(this, void 0, void 0, function* () {
        if (index_1.userdata.settings.WebHookURL !== "")
          yield (0, webHookHandler_1.webhookHandler)(log);
      });
    });
  });
}
function createFilelogger(fileFormat) {
  return __awaiter(this, void 0, void 0, function* () {
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
  });
}
//# sourceMappingURL=logger.js.map
