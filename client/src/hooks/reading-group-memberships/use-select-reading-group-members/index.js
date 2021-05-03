import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectReadingGroupMembers() {
  const readingGroupMembers = useSelector(state =>
    select(requests.feReadingGroupMembers, state.entityStore)
  );
  const readingGroupMembersMeta = useSelector(state =>
    meta(requests.feReadingGroupMembers, state.entityStore)
  );

  return { readingGroupMembers, readingGroupMembersMeta };
}
