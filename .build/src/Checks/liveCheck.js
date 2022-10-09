var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  allOfflineCheck: () => allOfflineCheck,
  customallOfflineCheck: () => customallOfflineCheck,
  liveCheck: () => liveCheck
});
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_restartHandler = __toModule(require("../functions/handler/restartHandler"));
var import_util = __toModule(require("../utils/util"));
var import__ = __toModule(require("../index"));
var import_custompageHandler = __toModule(require("../functions/handler/custompageHandler"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
async function liveCheck(channelLogin, custom) {
  if (channelLogin !== void 0) {
    let status = await TwitchGQL.GetLiveStatus(channelLogin);
    if (!status) {
      import_winston.default.info(import_chalk.default.red("Current Channel offline... Looking for new one..."), { event: "offline" });
      if (custom) {
        await (0, import_custompageHandler.customrestartHandler)(true);
      } else {
        await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
      }
    }
  } else {
    import_winston.default.info(import_chalk.default.red("No Channel Live at the moment for this Drop... Looking for new one..."), { event: "offline" });
    if (custom) {
      await (0, import_custompageHandler.customrestartHandler)(true);
    } else {
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  }
}
async function allOfflineCheck() {
  let dropsoffline = 0;
  import__.userdata.drops.forEach((drop) => {
    if (!drop.live) {
      dropsoffline++;
    }
  });
  if (dropsoffline === import__.userdata.drops.length) {
    if (import__.userdata.settings.WaitforChannels && import__.userdata.settings.Prioritylist.length === 0) {
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.red("All Drops for this game are offline... Looking for new live Channels in 5 minutes..."), { event: "offline" });
      import_winston.default.silly(" ", { event: "progressEnd" });
      await (0, import_util.delay)(3e5);
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    } else {
      import_winston.default.silly(" ");
      if (import__.userdata.settings.Prioritylist.length === 0)
        import_winston.default.warn(import_chalk.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
      import_winston.default.info(import_chalk.default.red("All Drops for this game are offline... Looking for new game..."), { event: "newGame" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, true);
    }
  }
}
async function customallOfflineCheck() {
  let dropsoffline = 0;
  import__.userdata.customchannel.forEach((drop) => {
    if (!drop.live) {
      dropsoffline++;
    }
  });
  if (dropsoffline === import__.userdata.customchannel.length) {
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.red("All Channels are offline... Looking for new live Channels in 5 minutes..."), { event: "offline" });
    import_winston.default.silly(" ", { event: "progressEnd" });
    await (0, import_util.delay)(3e5);
    await (0, import_custompageHandler.customrestartHandler)(true);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  allOfflineCheck,
  customallOfflineCheck,
  liveCheck
});
//# sourceMappingURL=liveCheck.js.map
