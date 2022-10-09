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
  dateCheck: () => dateCheck
});
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_restartHandler = __toModule(require("../functions/handler/restartHandler"));
async function dateCheck(CurrentDrop, onlymatch) {
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
      import_winston.default.silly(" ");
      import_winston.default.info(import_chalk.default.yellow("All Drops are stopped or nonActive at the moment... Looking for new ones..."), { event: "newDrop" });
      await (0, import_restartHandler.restartHandler)(true, true, true, true, false);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dateCheck
});
//# sourceMappingURL=dateCheck.js.map
