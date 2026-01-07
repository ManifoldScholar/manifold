import { useCurrentUser } from "hooks";

export default function useUnverifiedMessage(currentGroupId, currentGroupData) {
  const currentUser = useCurrentUser();

  const established = currentUser?.attributes.established;
  const trusted = currentUser?.attributes.trusted;

  if (established || trusted) return false;

  if (currentGroupId === "private") return false;
  if (currentGroupId === "public") return true;

  return currentGroupData?.attributes.privacy === "public";
}
