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
exports.dateCheck = void 0;
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const restartHandler_1 = require("../functions/handler/restartHandler");
function dateCheck(CurrentDrop, onlymatch) {
  return __awaiter(this, void 0, void 0, function* () {
    for (const [i, drop] of CurrentDrop.timebasedrop.entries()) {
      let currentDate = new Date().toISOString();
      let endDate = new Date(drop.endAt).toISOString();
      let startDate = new Date(drop.startAt).toISOString();
      let dropslenght = CurrentDrop.timebasedrop.length;
      let noworkingamount = 0;
      if (currentDate >= endDate) {
        drop.self["status"] = "Ended";
        noworkingamount++;
      }
      if (currentDate <= startDate) {
        drop.self["status"] = "Not Active";
        noworkingamount++;
      }
      if (currentDate > startDate && currentDate < endDate) {
        drop.self["status"] = "Active";
      }
      if (noworkingamount === dropslenght && !onlymatch) {
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.yellow("All Drops are stopped or nonActive at the moment... Looking for new ones..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    }
  });
}
exports.dateCheck = dateCheck;
//# sourceMappingURL=dateCheck.js.map
