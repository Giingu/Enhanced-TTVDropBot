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
  default: () => versionCheck_default
});
var import_util = __toModule(require("../utils/util"));
const winston = require("winston");
const axios = require("axios");
const chalk = require("chalk");
async function versionCheck_default(version) {
  const url = "http://144.91.124.143:3004/ttvdropbot-dev";
  const req = await axios.get(url, { raxConfig: import_util.retryConfig }).then((data) => {
    return data.data;
  }).catch((err) => {
    winston.error("ERROR: Could not check the version...");
    throw err;
  });
  if (req.version !== version) {
    winston.silly(" ");
    winston.info(chalk.green("New Version to download available...") + " | " + chalk.gray("Your Version: ") + chalk.magenta(version + " (main)") + " | " + chalk.gray("Newest Version: ") + chalk.magenta(req.version));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=versionCheck.js.map
