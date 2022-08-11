import { CaseTypes } from "../../data/CaseTypes";

export const caseIcons: Record<CaseTypes, string> = {
  [CaseTypes.Ban]: "🔨",
  [CaseTypes.Unban]: "🟢",
  [CaseTypes.Note]: "📝",
  [CaseTypes.Warn]: "⚠️",
  [CaseTypes.Kick]: "👢",
  [CaseTypes.Mute]: "🔇",
  [CaseTypes.Unmute]: "🟢",
  [CaseTypes.Deleted]: "⛔",
  [CaseTypes.Softban]: "👢",
};
