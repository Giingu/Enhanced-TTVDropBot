"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userdataclass = void 0;
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
exports.userdataclass = userdataclass;
//# sourceMappingURL=userdata.js.map
