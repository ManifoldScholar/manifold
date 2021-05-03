import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectReadingGroupMembership() {
  const readingGroupMembership = useSelector(state =>
    select(requests.feReadingGroupMembershipShow, state.entityStore)
  );
  const readingGroupMembershipMeta = useSelector(state =>
    meta(requests.feReadingGroupMembershipShow, state.entityStore)
  );

  return { readingGroupMembership, readingGroupMembershipMeta };
}
