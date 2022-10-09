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
const util_1 = require("../utils/util");
const winston = require("winston");
const axios = require("axios");
const chalk = require("chalk");
function default_1(version) {
  return __awaiter(this, void 0, void 0, function* () {
    const url = "http://144.91.124.143:3004/ttvdropbot-dev";
    const req = yield axios.get(url, { raxConfig: util_1.retryConfig }).then((data) => {
      return data.data;
    }).catch((err) => {
      winston.error("ERROR: Could not check the version...");
      throw err;
    });
    if (req.version !== version) {
      winston.silly(" ");
      winston.info(chalk.green("New Version to download available...") + " | " + chalk.gray("Your Version: ") + chalk.magenta(version + " (main)") + " | " + chalk.gray("Newest Version: ") + chalk.magenta(req.version));
    }
  });
}
exports.default = default_1;
//# sourceMappingURL=versionCheck.js.map
