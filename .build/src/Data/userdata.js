var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  userdataclass: () => userdataclass
});
class userdataclass {
  constructor() {
    this.loginpageurl = "https://www.twitch.tv/login";
    this.cookies = [];
    this.auth_token = "";
    this.watch_option = "";
    this.game = "";
    this.clientid = "";
    this.userid = "";
    this.drops = [];
    this.claimedDrops = [];
    this.nonActiveDrops = [];
    this.availableDropNameChoices = [];
    this.startDrop = "";
    this.showtoken = false;
    this.settings = {
      Chromeexe: "",
      UserDataPath: "",
      WebHookURL: "",
      WebHookEvents: [],
      debug: false,
      displayless: false,
      ProgressCheckInterval: 6e4,
      RetryDelay: 6e4,
      WaitforChannels: false,
      Prioritylist: [],
      AutoClaim: true,
      LogToFile: true,
      ForceCustomChannel: false,
      UseKeepAlive: false,
      AutoPoints: false
    };
    this.customchannel = [];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userdataclass
});
//# sourceMappingURL=userdata.js.map
