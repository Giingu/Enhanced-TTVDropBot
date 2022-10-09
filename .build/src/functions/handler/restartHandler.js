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
  restartHandler: () => restartHandler
});
var import_watchpageHandler = __toModule(require("./watchpageHandler"));
var import_getTwitchDrops = __toModule(require("../get/getTwitchDrops"));
var import_startWatching = __toModule(require("../startWatching"));
var import__ = __toModule(require("../../index"));
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_util = __toModule(require("../../utils/util"));
async function restartHandler(random, filterlive, filterNonActive, filterlast, newgame) {
  if (!newgame) {
    await (0, import_watchpageHandler.WatchingEventHandlerStop)();
    await (0, import_getTwitchDrops.askWhatDropToStart)(random, filterlive, filterNonActive, filterlast);
    await (0, import_startWatching.startWatching)();
  } else if (newgame && import__.userdata.settings.Prioritylist.length > 0) {
    await (0, import_watchpageHandler.WatchingEventHandlerStop)();
    await selectGamefromList();
    await (0, import_getTwitchDrops.getTwitchDrops)(import__.userdata.game, true).then(async () => {
      await (0, import_getTwitchDrops.askWhatDropToStart)(random, filterlive, filterNonActive, filterlast);
      await (0, import_startWatching.startWatching)();
    });
  } else {
    await (0, import_watchpageHandler.WatchingEventHandlerStop)();
    await (0, import_getTwitchDrops.askWhatGameToWatch)(true);
    await (0, import_getTwitchDrops.getTwitchDrops)(import__.userdata.game, true).then(async () => {
      await (0, import_getTwitchDrops.askWhatDropToStart)(random, filterlive, filterNonActive, filterlast);
      await (0, import_startWatching.startWatching)();
    });
  }
}
async function selectGamefromList() {
  let activecampainnames = await (0, import_getTwitchDrops.getActiveCampaigns)();
  if (import__.userdata.settings.Prioritylist.length === 0) {
    import_winston.default.warn(import_chalk.default.yellow("Warning: Please add Games to your Priority List, otherwise the bot will select a random game... or disable this feature in the settings..."));
    import__.userdata.game = activecampainnames[(0, import_util.getRandomInt)(import__.userdata.availableDropNameChoices.length)];
    import_winston.default.info(import_chalk.default.gray("Selected a random Game to watch: " + import_chalk.default.white(import__.userdata.game)));
  } else {
    let gameselected = "";
    for (const [i, game] of import__.userdata.settings.Prioritylist.entries()) {
      if (import__.userdata.game === game) {
        if (import__.userdata.settings.Prioritylist.length - 1 === i) {
          gameselected = import__.userdata.settings.Prioritylist[0];
        } else {
          gameselected = import__.userdata.settings.Prioritylist[i + 1];
        }
      }
    }
    if (gameselected === "")
      gameselected = import__.userdata.settings.Prioritylist[0];
    import__.userdata.game = gameselected;
    import_winston.default.silly(" ");
    import_winston.default.info(import_chalk.default.gray("Selected ") + import_chalk.default.white(gameselected) + import_chalk.default.gray(" as next game from your Priority list... Watching in 45 seconds..."), { event: "newGame" });
    import_winston.default.silly(" ", { event: "progressEnd" });
    await (0, import_util.delay)(45e3);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  restartHandler
});
//# sourceMappingURL=restartHandler.js.map
