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
exports.getCurrentDrop = void 0;
const index_1 = require("../../index");
function getCurrentDrop() {
  return __awaiter(this, void 0, void 0, function* () {
    let CurrentDrop = {
      dropid: "",
      dropname: "",
      Connected: false,
      allowedchannels: [],
      timebasedrop: [],
      live: false,
      foundlivech: [],
      isClaimed: false
    };
    for (const drop of index_1.userdata.drops) {
      if (index_1.userdata.startDrop === drop.dropname) {
        CurrentDrop = drop;
      }
    }
    return CurrentDrop;
  });
}
exports.getCurrentDrop = getCurrentDrop;
//# sourceMappingURL=getCurrentDrop.js.map
