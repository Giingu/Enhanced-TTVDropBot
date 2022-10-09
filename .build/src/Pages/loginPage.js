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
  Login: () => Login
});
var import_chalk = __toModule(require("chalk"));
var import__ = __toModule(require("../index"));
const winston = require("winston");
const fs = require("fs");
const inputReader = require("wait-console-input");
const puppeteer = require("puppeteer-core");
async function Login() {
  await puppeteer.launch({ headless: false, executablePath: import__.userdata.settings.Chromeexe, userDataDir: import__.userdata.settings.UserDataPath, args: ["--no-sandbox"] }).then(async (browser) => {
    const loginpage = await browser.newPage();
    await loginpage.setDefaultTimeout(0);
    if (import__.userdata.settings.UserDataPath === "" && fs.existsSync("./twitch-session.json")) {
      let file = fs.readFileSync("./twitch-session.json", "utf8");
      let cokkies = await JSON.parse(file);
      await loginpage.setCookie.apply(loginpage, cokkies);
    }
    winston.silly(" ");
    winston.info(import_chalk.default.gray("Starting Login Page..."));
    await loginpage.goto(import__.userdata.loginpageurl, { waitUntil: "networkidle2" });
    await loginpage.waitForNavigation().then(async () => {
      if (loginpage.url() !== "https://www.twitch.tv/?no-reload=true") {
        if (!import__.userdata.settings.displayless)
          inputReader.wait(import_chalk.default.gray("Press any Key to continue..."));
        process.exit(22);
      }
      winston.silly(" ");
      winston.info(import_chalk.default.green("Success Login..."));
      winston.silly(" ");
      winston.info(import_chalk.default.gray("Saving Cookies..."));
      import__.userdata.cookies = await loginpage.cookies();
      await fs.promises.writeFile("twitch-session.json", JSON.stringify(import__.userdata.cookies, null, 2)).then(function() {
        winston.silly(" ");
        winston.info(import_chalk.default.green("Successfully Saved Cookies..."));
        winston.silly(" ");
      }).catch((err) => {
        throw err;
      });
    });
    winston.silly(" ");
    winston.info(import_chalk.default.gray("Closing Browser and Moving on..."));
    await browser.close();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Login
});
//# sourceMappingURL=loginPage.js.map
