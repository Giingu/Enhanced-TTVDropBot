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
  CustomEventHandlerStart: () => CustomEventHandlerStart,
  customrestartHandler: () => customrestartHandler
});
var import__ = __toModule(require("../../index"));
var import_liveCheck = __toModule(require("../../Checks/liveCheck"));
var import_watchpageHandler = __toModule(require("./watchpageHandler"));
var import_pointsCheck = __toModule(require("../../Checks/pointsCheck"));
var import_util = __toModule(require("../../utils/util"));
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_getCustomChannel = __toModule(require("../get/getCustomChannel"));
let status = "stopped";
async function CustomEventHandlerStart(DropcurrentlyWatching) {
  if (status === "stopped") {
    await (0, import_liveCheck.customallOfflineCheck)();
    await (0, import_liveCheck.liveCheck)(DropcurrentlyWatching, true);
    await (0, import_pointsCheck.pointsCheck)(DropcurrentlyWatching);
    await (0, import_watchpageHandler.sendMinuteWatched)(DropcurrentlyWatching.toString().toLowerCase());
    status = "running";
    await customloop(DropcurrentlyWatching);
  } else if (status === "running") {
    await customloop(DropcurrentlyWatching);
  }
}
let watchedtime = 0;
async function customloop(channelLogin) {
  await (0, import_util.delay)(import__.userdata.settings.ProgressCheckInterval);
  watchedtime = watchedtime + import__.userdata.settings.ProgressCheckInterval;
  await getCustomDrop(channelLogin).then(async (currentdrop) => {
    await (0, import_getCustomChannel.customCheckLive)(false);
    await (0, import_liveCheck.customallOfflineCheck)();
    await (0, import_liveCheck.liveCheck)(channelLogin, true);
    let neededtimeinms = currentdrop.Time * 6e4;
    if (status === "running") {
      if (currentdrop.WatchType === "Watch until time runs out") {
        if (watchedtime < neededtimeinms) {
          await (0, import_pointsCheck.pointsCheck)(channelLogin).then(async (points) => {
            await (0, import_watchpageHandler.sendMinuteWatched)(channelLogin.toString().toLowerCase());
            import_winston.default.info(import_chalk.default.gray("Watching since: ") + import_chalk.default.white(Number(watchedtime / 6e4).toFixed(2)) + import_chalk.default.gray(" | Minutes Left: " + import_chalk.default.white((neededtimeinms - watchedtime) / 6e4)) + import_chalk.default.gray(" | Points: ") + import_chalk.default.white(points.toString()), { event: "progress" });
            import_winston.default.silly("", { event: "progressEnd" });
            await customloop(channelLogin);
          });
        } else if (watchedtime >= neededtimeinms) {
          status = "stopped";
          import_winston.default.info(import_chalk.default.green("Finished watching the channel: " + channelLogin), { event: "newDrop" });
          import_winston.default.info(import_chalk.default.gray("Looking for a new Channel..."), { event: "newDrop" });
          await customrestartHandler(true);
        }
      } else {
        await (0, import_pointsCheck.pointsCheck)(channelLogin).then(async (points) => {
          await (0, import_watchpageHandler.sendMinuteWatched)(channelLogin.toString().toLowerCase());
          import_winston.default.info(import_chalk.default.gray("Watching since: ") + import_chalk.default.white(Number(watchedtime / 6e4).toFixed(2)) + import_chalk.default.gray(" | Points: ") + import_chalk.default.white(points.toString()), { event: "progress" });
          import_winston.default.silly("", { event: "progressEnd" });
          await customloop(channelLogin);
        });
      }
    }
  });
}
async function customrestartHandler(random) {
  watchedtime = 0;
  await (0, import_getCustomChannel.customCheckLive)(false);
  await (0, import_getCustomChannel.askCustomChannelStart)(random, true);
  await CustomEventHandlerStart(import__.userdata.startDrop);
}
async function getCustomDrop(ChannelLogin) {
  let currentdrop = {
    Name: "",
    TTVLink: "",
    WatchType: "",
    Time: 0,
    Points: false,
    live: false
  };
  import__.userdata.customchannel.forEach((drop) => {
    if (drop.TTVLink === "https://www.twitch.tv/" + ChannelLogin) {
      currentdrop = drop;
    }
  });
  return currentdrop;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CustomEventHandlerStart,
  customrestartHandler
});
//# sourceMappingURL=custompageHandler.js.map
