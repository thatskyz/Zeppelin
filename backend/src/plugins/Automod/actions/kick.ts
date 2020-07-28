import * as t from "io-ts";
import { automodAction } from "../helpers";
import { LogType } from "../../../data/LogType";
import { asyncMap, resolveMember, tNullable } from "../../../utils";
import { resolveActionContactMethods } from "../functions/resolveActionContactMethods";
import { ModActionsPlugin } from "../../ModActions/ModActionsPlugin";

export const KickAction = automodAction({
  configType: t.type({
    reason: tNullable(t.string),
    notify: tNullable(t.string),
    notifyChannel: tNullable(t.string),
  }),

  async apply({ pluginData, contexts, actionConfig }) {
    const reason = actionConfig.reason || "Kicked automatically";
    const contactMethods = resolveActionContactMethods(pluginData, actionConfig);

    const caseArgs = {
      modId: pluginData.client.user.id,
      extraNotes: [
        /* TODO */
      ],
    };

    const userIdsToKick = contexts.map(c => c.user?.id).filter(Boolean);
    const membersToKick = await asyncMap(userIdsToKick, id => resolveMember(pluginData.client, pluginData.guild, id));

    const modActions = pluginData.getPlugin(ModActionsPlugin);
    for (const member of membersToKick) {
      await modActions.kickMember(member, reason, { contactMethods, caseArgs });
    }
  },
});
