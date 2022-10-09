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
const index_1 = require("../../index");
const inquirer = require("inquirer");
function default_1() {
  return __awaiter(this, void 0, void 0, function* () {
    if (!index_1.userdata.settings.displayless) {
      let options = ["Twitch Drops", "Custom Channels"];
      yield inquirer.prompt([
        {
          type: "list",
          name: "watchoptions",
          message: "What do u wanna watch?",
          choices: options
        }
      ]).then((answer) => __awaiter(this, void 0, void 0, function* () {
        index_1.userdata.watch_option = answer.watchoptions;
      }));
      return index_1.userdata.watch_option;
    } else {
      index_1.userdata.watch_option = "Twitch Drops";
    }
  });
}
exports.default = default_1;
//# sourceMappingURL=getWatchOption.js.map
