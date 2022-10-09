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
  userdata: () => userdata,
  version: () => version
});
var import_userdata = __toModule(require("./Data/userdata"));
var import_chalk = __toModule(require("chalk"));
var import_versionCheck = __toModule(require("./Checks/versionCheck"));
var import_getSettings = __toModule(require("./functions/get/getSettings"));
var import_getWatchOption = __toModule(require("./functions/get/getWatchOption"));
var import_getTwitchDrops = __toModule(require("./functions/get/getTwitchDrops"));
var import_startWatching = __toModule(require("./functions/startWatching"));
var import_defaultlogin = __toModule(require("./functions/login/defaultlogin"));
var import_fs = __toModule(require("fs"));
var import_getCustomChannel = __toModule(require("./functions/get/getCustomChannel"));
var import_custompageHandler = __toModule(require("./functions/handler/custompageHandler"));
var import_validateAuthToken = __toModule(require("./Checks/validateAuthToken"));
var import_getArgs = __toModule(require("./functions/get/getArgs"));
var rax = __toModule(require("retry-axios"));
var import_util = __toModule(require("./utils/util"));
const version = "2.0.0.4";
let userdata = new import_userdata.userdataclass();
const winston = require("winston");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
(async () => {
  await (0, import_getArgs.setArgs)();
  await (0, import_getSettings.default)();
  await (0, import_getArgs.matchArgs)();
  await setRetries();
  await (0, import_getSettings.logimportantvalues)();
  await (0, import_versionCheck.default)(version);
  if (userdata.settings.UseKeepAlive)
    keepAlive();
  await (0, import_defaultlogin.login)();
  await (0, import_validateAuthToken.validateAuthToken)();
  if (!userdata.settings.displayless) {
    await (0, import_getWatchOption.default)();
    await watchoptionSwitch();
  } else {
    if (userdata.settings.ForceCustomChannel) {
      if (import_fs.default.existsSync("./CustomChannels.json")) {
        userdata.watch_option = "Custom Channels";
      } else {
        winston.warn(import_chalk.default.yellow("Cant force custom channels without a CustomChannels.json"));
        userdata.watch_option = "Twitch Drops";
      }
    } else {
      userdata.watch_option = "Twitch Drops";
    }
    await watchoptionSwitch();
  }
  winston.info(import_chalk.default.gray("Idle!"));
})();
async function watchoptionSwitch() {
  switch (userdata.watch_option) {
    case "Twitch Drops":
      await (0, import_getTwitchDrops.askWhatGameToWatch)(false);
      await (0, import_getTwitchDrops.getTwitchDrops)(userdata.game, true);
      if (userdata.settings.displayless) {
        await (0, import_getTwitchDrops.askWhatDropToStart)(true, true, true, false);
      } else {
        await (0, import_getTwitchDrops.askWhatDropToStart)(false, true, true, false);
      }
      await (0, import_startWatching.startWatching)();
      break;
    case "Custom Channels":
      await (0, import_getCustomChannel.getCustomChannel)();
      await (0, import_custompageHandler.CustomEventHandlerStart)(userdata.startDrop);
      break;
  }
}
async function setRetries() {
  await TwitchGQL.SetRetryTimeout(userdata.settings.RetryDelay).then(() => {
    import_util.retryConfig.retryDelay = userdata.settings.RetryDelay;
    rax.attach();
  });
}
function keepAlive(port = process.env.PORT) {
  const express = require("express");
  const app = express();
  app.get("/", (req, res) => res.send("TwitchDropBot is alive"));
  app.listen(port, () => winston.info(`App listening on port ${port || 0}`));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userdata,
  version
});
//# sourceMappingURL=index.js.map
