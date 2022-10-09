"use strict";
var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() {
      return m[k];
    } };
  }
  Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = exports && exports.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
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
exports.retryConfig = exports.delay = exports.minutestoPercent = exports.livechresponse = exports.claimedstatustoString = exports.statustoString = exports.getRandomInt = exports.validURL = exports.validPath = void 0;
const rax = __importStar(require("retry-axios"));
const winston_1 = __importDefault(require("winston"));
const index_1 = require("../index");
const chalk = require("chalk");
const fs = require("fs");
function validPath(str) {
  if (fs.existsSync(str) && str.endsWith(".exe")) {
    return true;
  } else {
    return "Please provide a Valid Path...";
  }
}
exports.validPath = validPath;
function validURL(str) {
  if (str.startsWith("https://www.twitch.tv/")) {
    return true;
  } else {
    return "Please provide a Valid URL...";
  }
}
exports.validURL = validURL;
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
exports.getRandomInt = getRandomInt;
function statustoString(status) {
  if (!status) {
    return chalk.red("Offline");
  } else {
    return chalk.greenBright("Live");
  }
}
exports.statustoString = statustoString;
function claimedstatustoString(streamer) {
  return streamer ? chalk.greenBright.italic("Claimed") : chalk.red.italic("Unclaimed");
}
exports.claimedstatustoString = claimedstatustoString;
function livechresponse(foundlivechs) {
  if (foundlivechs.length >= 1) {
    return chalk.cyanBright(foundlivechs[0]);
  } else if (foundlivechs.length === 0) {
    return chalk.cyan("No Channel Live");
  }
}
exports.livechresponse = livechresponse;
function minutestoPercent(timewatched, maxtime) {
  let result = 100 / maxtime * timewatched;
  let resultr = Math.round((result + Number.EPSILON) * 100) / 100;
  return resultr;
}
exports.minutestoPercent = minutestoPercent;
function delay(ms) {
  return __awaiter(this, void 0, void 0, function* () {
    return yield new Promise((resolve) => setTimeout(resolve, ms));
  });
}
exports.delay = delay;
exports.retryConfig = {
  retry: 3,
  noResponseRetries: 3,
  retryDelay: index_1.userdata.settings.RetryDelay,
  statusCodesToRetry: [[100, 199], [429, 429, 400], [500, 599]],
  httpMethodsToRetry: ["GET", "HEAD", "OPTIONS", "DELETE", "PUT", "POST"],
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err);
    winston_1.default.info(chalk.yellow("Failed axios Request... Retrying in " + Math.round((cfg === null || cfg === void 0 ? void 0 : cfg.retryDelay) / 1e3 * 100) / 100 + " seconds... Try: " + (cfg === null || cfg === void 0 ? void 0 : cfg.currentRetryAttempt) + "/3 " + err), { event: "requestRetry" });
  },
  backoffType: "static"
};
//# sourceMappingURL=util.js.map
