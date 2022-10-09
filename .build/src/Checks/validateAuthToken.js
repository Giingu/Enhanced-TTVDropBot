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
  validateAuthToken: () => validateAuthToken
});
var import__ = __toModule(require("../index"));
var import_axios = __toModule(require("axios"));
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
var import_util = __toModule(require("../utils/util"));
async function validateAuthToken() {
  let auth = "OAuth " + import__.userdata.auth_token;
  let head = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
    Authorization: auth
  };
  await import_axios.default.get("https://id.twitch.tv/oauth2/validate", { headers: head, raxConfig: import_util.retryConfig }).then(function(response) {
    let response_data = response.data;
    import__.userdata.userid = response_data.user_id;
    import__.userdata.clientid = response_data.client_id;
    if (import__.userdata.showtoken)
      import_winston.default.info(import_chalk.default.yellow("Warning: Your Token is revealed, please only reveal if necessary..."));
    if (import__.userdata.showtoken)
      import_winston.default.info(import_chalk.default.yellow("Your Auth Token: " + import_chalk.default.white(import__.userdata.auth_token)));
  }).catch(function(error) {
    import_winston.default.error(import_chalk.default.red("ERROR: Could not validate your auth token..."));
    throw error.response.status + " " + error.response.statusText + " " + error.response.data.message;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateAuthToken
});
//# sourceMappingURL=validateAuthToken.js.map
