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
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointsCheck = void 0;
const index_1 = require("../index");
const winston_1 = __importDefault(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();
let points = 0;
function pointsCheck(channelLogin) {
  return __awaiter(this, void 0, void 0, function* () {
    const opts = {
      channelLogin
    };
    const pointsrequest = yield TwitchGQL._SendQuery("ChannelPointsContext", opts, "1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024", "OAuth " + index_1.userdata.auth_token, true, {}, true);
    points = pointsrequest[0].data.community.channel.self.communityPoints.balance;
    let channelID = pointsrequest[0].data.community.id;
    yield checkisClaimeable(pointsrequest, channelID, index_1.userdata.settings.AutoPoints);
    return points;
  });
}
exports.pointsCheck = pointsCheck;
function checkisClaimeable(request, channelId, autopoints) {
  return __awaiter(this, void 0, void 0, function* () {
    let ClaimId = "";
    try {
      ClaimId = request[0].data.community.channel.self.communityPoints.availableClaim.id;
    } catch (e) {
      if (index_1.userdata.settings.debug)
        winston_1.default.info("No points to be claimed...");
    }
    if (ClaimId !== "") {
      const opts = {
        input: {
          channelID: channelId,
          claimID: ClaimId
        }
      };
      if (autopoints) {
        const claimrequest = yield TwitchGQL._SendQuery("ClaimCommunityPoints", opts, "46aaeebe02c99afdf4fc97c7c0cba964124bf6b0af229395f1f6d1feed05b3d0", "OAuth " + index_1.userdata.auth_token, true, {}, true);
        points = claimrequest[0].data.claimCommunityPoints.currentPoints;
        winston_1.default.info(chalk_1.default.gray("Claimed Channel Points..."), { event: "claim" });
      } else if (!autopoints) {
        winston_1.default.info(chalk_1.default.gray("Skipping Points..."), { event: "claim" });
      }
    }
  });
}
//# sourceMappingURL=pointsCheck.js.map
