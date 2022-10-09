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
  pointsCheck: () => pointsCheck
});
var import__ = __toModule(require("../index"));
var import_winston = __toModule(require("winston"));
var import_chalk = __toModule(require("chalk"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
let points = 0;
async function pointsCheck(channelLogin) {
  const opts = {
    channelLogin
  };
  const pointsrequest = await TwitchGQL._SendQuery("ChannelPointsContext", opts, "1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024", "OAuth " + import__.userdata.auth_token, true, {}, true);
  points = pointsrequest[0].data.community.channel.self.communityPoints.balance;
  let channelID = pointsrequest[0].data.community.id;
  await checkisClaimeable(pointsrequest, channelID, import__.userdata.settings.AutoPoints);
  return points;
}
async function checkisClaimeable(request, channelId, autopoints) {
  let ClaimId = "";
  try {
    ClaimId = request[0].data.community.channel.self.communityPoints.availableClaim.id;
  } catch (e) {
    if (import__.userdata.settings.debug)
      import_winston.default.info("No points to be claimed...");
  }
  if (ClaimId !== "") {
    const opts = {
      input: {
        channelID: channelId,
        claimID: ClaimId
      }
    };
    if (autopoints) {
      const claimrequest = await TwitchGQL._SendQuery("ClaimCommunityPoints", opts, "46aaeebe02c99afdf4fc97c7c0cba964124bf6b0af229395f1f6d1feed05b3d0", "OAuth " + import__.userdata.auth_token, true, {}, true);
      points = claimrequest[0].data.claimCommunityPoints.currentPoints;
      import_winston.default.info(import_chalk.default.gray("Claimed Channel Points..."), { event: "claim" });
    } else if (!autopoints) {
      import_winston.default.info(import_chalk.default.gray("Skipping Points..."), { event: "claim" });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  pointsCheck
});
//# sourceMappingURL=pointsCheck.js.map
