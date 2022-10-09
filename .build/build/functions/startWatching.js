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
var __asyncValues = exports && exports.__asyncValues || function(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
};
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWatching = void 0;
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../index");
const watchpageHandler_1 = require("./handler/watchpageHandler");
function startWatching() {
  var e_1, _a;
  return __awaiter(this, void 0, void 0, function* () {
    let channelLogin = "";
    try {
      for (var _b = __asyncValues(index_1.userdata.drops), _c; _c = yield _b.next(), !_c.done; ) {
        const Drops = _c.value;
        if (Drops.dropname === index_1.userdata.startDrop) {
          channelLogin = Drops.foundlivech[0];
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return))
          yield _a.call(_b);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    winston_1.default.silly(" ");
    winston_1.default.info(chalk_1.default.gray("Starting to watch.."), { event: "progress" });
    yield (0, watchpageHandler_1.WatchingEventHandlerStart)(channelLogin);
  });
}
exports.startWatching = startWatching;
//# sourceMappingURL=startWatching.js.map
