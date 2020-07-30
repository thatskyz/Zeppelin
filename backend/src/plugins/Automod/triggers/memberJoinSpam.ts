import * as t from "io-ts";
import { automodTrigger } from "../helpers";
import { convertDelayStringToMS, tDelayString } from "../../../utils";
import { getMatchingRecentActions } from "../functions/getMatchingRecentActions";
import { RecentActionType } from "../constants";
import { sumRecentActionCounts } from "../functions/sumRecentActionCounts";
import { findRecentSpam } from "../functions/findRecentSpam";

export const MemberJoinSpamTrigger = automodTrigger<unknown>()({
  configType: t.type({
    amount: t.number,
    within: tDelayString,
  }),

  defaultConfig: {},

  async match({ pluginData, context, triggerConfig }) {
    if (!context.joined || !context.member) {
      return;
    }

    const recentSpam = findRecentSpam(pluginData, RecentActionType.MemberJoin);
    if (recentSpam) {
      context.actioned = true;
      return {};
    }

    const since = Date.now() - convertDelayStringToMS(triggerConfig.within);
    const matchingActions = getMatchingRecentActions(pluginData, RecentActionType.MemberJoin, null, since);
    const totalCount = sumRecentActionCounts(matchingActions);

    if (totalCount >= triggerConfig.amount) {
      const extraContexts = matchingActions.map(a => a.context).filter(c => c !== context);

      pluginData.state.recentSpam.push({
        type: RecentActionType.MemberJoin,
        timestamp: Date.now(),
        archiveId: null,
        userIds: [],
      });

      return {
        extraContexts,
      };
    }
  },

  renderMatchInformation({ pluginData, contexts, triggerConfig }) {
    return null;
  },
});
