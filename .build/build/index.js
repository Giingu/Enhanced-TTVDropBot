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
exports.userdata = exports.version = void 0;
exports.version = "2.0.0.4";
const userdata_1 = require("./Data/userdata");
exports.userdata = new userdata_1.userdataclass();
const chalk_1 = __importDefault(require("chalk"));
const versionCheck_1 = __importDefault(require("./Checks/versionCheck"));
const getSettings_1 = __importStar(require("./functions/get/getSettings"));
const getWatchOption_1 = __importDefault(require("./functions/get/getWatchOption"));
const getTwitchDrops_1 = require("./functions/get/getTwitchDrops");
const startWatching_1 = require("./functions/startWatching");
const defaultlogin_1 = require("./functions/login/defaultlogin");
const fs_1 = __importDefault(require("fs"));
const getCustomChannel_1 = require("./functions/get/getCustomChannel");
const custompageHandler_1 = require("./functions/handler/custompageHandler");
const validateAuthToken_1 = require("./Checks/validateAuthToken");
const getArgs_1 = require("./functions/get/getArgs");
const rax = __importStar(require("retry-axios"));
const util_1 = require("./utils/util");
const winston = require("winston");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
(() => __awaiter(void 0, void 0, void 0, function* () {
  yield (0, getArgs_1.setArgs)();
  yield (0, getSettings_1.default)();
  yield (0, getArgs_1.matchArgs)();
  yield setRetries();
  yield (0, getSettings_1.logimportantvalues)();
  yield (0, versionCheck_1.default)(exports.version);
  if (exports.userdata.settings.UseKeepAlive)
    keepAlive();
  yield (0, defaultlogin_1.login)();
  yield (0, validateAuthToken_1.validateAuthToken)();
  if (!exports.userdata.settings.displayless) {
    yield (0, getWatchOption_1.default)();
    yield watchoptionSwitch();
  } else {
    if (exports.userdata.settings.ForceCustomChannel) {
      if (fs_1.default.existsSync("./CustomChannels.json")) {
        exports.userdata.watch_option = "Custom Channels";
      } else {
        winston.warn(chalk_1.default.yellow("Cant force custom channels without a CustomChannels.json"));
        exports.userdata.watch_option = "Twitch Drops";
      }
    } else {
      exports.userdata.watch_option = "Twitch Drops";
    }
    yield watchoptionSwitch();
  }
  winston.info(chalk_1.default.gray("Idle!"));
}))();
function watchoptionSwitch() {
  return __awaiter(this, void 0, void 0, function* () {
    switch (exports.userdata.watch_option) {
      case "Twitch Drops":
        yield (0, getTwitchDrops_1.askWhatGameToWatch)(false);
        yield (0, getTwitchDrops_1.getTwitchDrops)(exports.userdata.game, true);
        if (exports.userdata.settings.displayless) {
          yield (0, getTwitchDrops_1.askWhatDropToStart)(true, true, true, false);
        } else {
          yield (0, getTwitchDrops_1.askWhatDropToStart)(false, true, true, false);
        }
        yield (0, startWatching_1.startWatching)();
        break;
      case "Custom Channels":
        yield (0, getCustomChannel_1.getCustomChannel)();
        yield (0, custompageHandler_1.CustomEventHandlerStart)(exports.userdata.startDrop);
        break;
    }
  });
}
function setRetries() {
  return __awaiter(this, void 0, void 0, function* () {
    yield TwitchGQL.SetRetryTimeout(exports.userdata.settings.RetryDelay).then(() => {
      util_1.retryConfig.retryDelay = exports.userdata.settings.RetryDelay;
      rax.attach();
    });
  });
}
function keepAlive(port = process.env.PORT) {
  const express = require("express");
  const app = express();
  app.get("/", (req, res) => res.send("TwitchDropBot is alive"));
  app.listen(port, () => winston.info(`App listening on port ${port || 0}`));
}
//# sourceMappingURL=index.js.map
