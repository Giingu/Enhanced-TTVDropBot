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
exports.SamePercentCheck = void 0;
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const restartHandler_1 = require("../functions/handler/restartHandler");
let PercentChecker = false;
let LastPercentArray = [];
let CurrentPercentArray = [];
let SamePercent = 0;
function SamePercentCheck(CurrentDrop) {
  return __awaiter(this, void 0, void 0, function* () {
    CurrentPercentArray = [];
    CurrentDrop.timebasedrop.forEach((timedrop) => {
      CurrentPercentArray.push(timedrop.self.currentMinutesWatched);
    });
    if (!PercentChecker) {
      CurrentDrop.timebasedrop.forEach((timedrop) => {
        LastPercentArray.push(timedrop.self.currentMinutesWatched);
      });
      PercentChecker = true;
    } else if (PercentChecker) {
      if (JSON.stringify(LastPercentArray) === JSON.stringify(CurrentPercentArray)) {
        SamePercent++;
      } else if (JSON.stringify(LastPercentArray) !== JSON.stringify(CurrentPercentArray)) {
        LastPercentArray = CurrentPercentArray;
        SamePercent = 0;
      }
      if (SamePercent === 4) {
        SamePercent = 0;
        PercentChecker = false;
        LastPercentArray = [];
        CurrentPercentArray = [];
        winston_1.default.silly(" ");
        winston_1.default.info(chalk_1.default.yellow("All Drops have the same percentage for at least 4 tries... Looking for new Drops..."), { event: "newDrop" });
        yield (0, restartHandler_1.restartHandler)(true, true, true, true, false);
      }
    }
  });
}
exports.SamePercentCheck = SamePercentCheck;
//# sourceMappingURL=samepercentCheck.js.map
