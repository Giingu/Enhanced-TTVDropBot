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
exports.validateAuthToken = void 0;
const index_1 = require("../index");
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("../utils/util");
function validateAuthToken() {
  return __awaiter(this, void 0, void 0, function* () {
    let auth = "OAuth " + index_1.userdata.auth_token;
    let head = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
      Authorization: auth
    };
    yield axios_1.default.get("https://id.twitch.tv/oauth2/validate", { headers: head, raxConfig: util_1.retryConfig }).then(function(response) {
      let response_data = response.data;
      index_1.userdata.userid = response_data.user_id;
      index_1.userdata.clientid = response_data.client_id;
      if (index_1.userdata.showtoken)
        winston_1.default.info(chalk_1.default.yellow("Warning: Your Token is revealed, please only reveal if necessary..."));
      if (index_1.userdata.showtoken)
        winston_1.default.info(chalk_1.default.yellow("Your Auth Token: " + chalk_1.default.white(index_1.userdata.auth_token)));
    }).catch(function(error) {
      winston_1.default.error(chalk_1.default.red("ERROR: Could not validate your auth token..."));
      throw error.response.status + " " + error.response.statusText + " " + error.response.data.message;
    });
  });
}
exports.validateAuthToken = validateAuthToken;
//# sourceMappingURL=validateAuthToken.js.map
