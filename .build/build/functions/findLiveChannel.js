"use strict";
var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLiveChannel = void 0;
const index_1 = require("../index");
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
function findLiveChannel(allowedChannels) {
  return __awaiter(this, void 0, void 0, function* () {
    let foundlivechannel = [];
    if (allowedChannels !== null) {
      AllowedCHloop:
        for (const AllowedChannelElement of allowedChannels) {
          if (yield TwitchGQL.GetLiveStatus(AllowedChannelElement.name)) {
            let user = yield TwitchGQL.GetUser(AllowedChannelElement.name);
            if (user.data.user.stream === null) {
              return foundlivechannel;
            }
            let game = user.data.user.stream.game.name.toLowerCase();
            if (game === index_1.userdata.game.toLowerCase()) {
              let TagList = yield TwitchGQL._SendQuery("RealtimeStreamTagList", { channelLogin: AllowedChannelElement.name }, "9d952e4aacd4f8bb9f159bd4d5886d72c398007249a8b09e604a651fc2f8ac17", "OAuth " + index_1.userdata.auth_token, true, {}, true);
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
      const directorypagegame = yield TwitchGQL.GetDirectoryPageGame(index_1.userdata.game, opts);
      if (directorypagegame[0].data.game.streams === null) {
        return foundlivechannel;
      }
      if (directorypagegame[0].data.game.streams.edges.length > 0) {
        foundlivechannel.push(directorypagegame[0].data.game.streams.edges[0].node.broadcaster.login);
      }
    }
    return foundlivechannel;
  });
}
exports.findLiveChannel = findLiveChannel;
//# sourceMappingURL=findLiveChannel.js.map
