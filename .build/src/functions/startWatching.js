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
  startWatching: () => startWatching
});
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import__ = __toModule(require("../index"));
var import_watchpageHandler = __toModule(require("./handler/watchpageHandler"));
async function startWatching() {
  let channelLogin = "";
  for await (const Drops of import__.userdata.drops) {
    if (Drops.dropname === import__.userdata.startDrop) {
      channelLogin = Drops.foundlivech[0];
    }
  }
  import_winston.default.silly(" ");
  import_winston.default.info(import_chalk.default.gray("Starting to watch.."), { event: "progress" });
  await (0, import_watchpageHandler.WatchingEventHandlerStart)(channelLogin);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startWatching
});
//# sourceMappingURL=startWatching.js.map
