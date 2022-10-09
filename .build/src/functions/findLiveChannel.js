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
  findLiveChannel: () => findLiveChannel
});
var import__ = __toModule(require("../index"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
async function findLiveChannel(allowedChannels) {
  let foundlivechannel = [];
  if (allowedChannels !== null) {
    AllowedCHloop:
      for (const AllowedChannelElement of allowedChannels) {
        if (await TwitchGQL.GetLiveStatus(AllowedChannelElement.name)) {
          let user = await TwitchGQL.GetUser(AllowedChannelElement.name);
          if (user.data.user.stream === null) {
            return foundlivechannel;
          }
          let game = user.data.user.stream.game.name.toLowerCase();
          if (game === import__.userdata.game.toLowerCase()) {
            let TagList = await TwitchGQL._SendQuery("RealtimeStreamTagList", { channelLogin: AllowedChannelElement.name }, "9d952e4aacd4f8bb9f159bd4d5886d72c398007249a8b09e604a651fc2f8ac17", "OAuth " + import__.userdata.auth_token, true, {}, true);
            if (TagList[0].data.user.stream === null) {
              return foundlivechannel;
            }
            let Tags = TagList[0].data.user.stream.tags;
            for (const Tagelement of Tags) {
              if (Tagelement.id === "c2542d6d-cd10-4532-919b-3d19f30a768b") {
                foundlivechannel.push(AllowedChannelElement.name);
                break AllowedCHloop;
              }
            }
          }
        }
      }
  } else {
    let opts = {
      limit: 50,
      options: {
        sort: "VIEWER_COUNT",
        tags: ["c2542d6d-cd10-4532-919b-3d19f30a768b"]
      },
      sortTypeIsRecency: false
    };
    const directorypagegame = await TwitchGQL.GetDirectoryPageGame(import__.userdata.game, opts);
    if (directorypagegame[0].data.game.streams === null) {
      return foundlivechannel;
    }
    if (directorypagegame[0].data.game.streams.edges.length > 0) {
      foundlivechannel.push(directorypagegame[0].data.game.streams.edges[0].node.broadcaster.login);
    }
  }
  return foundlivechannel;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findLiveChannel
});
//# sourceMappingURL=findLiveChannel.js.map
