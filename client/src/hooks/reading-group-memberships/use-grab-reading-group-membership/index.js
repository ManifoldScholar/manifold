import { useSelector } from "react-redux";
import get from "lodash/get";
import { requests } from "api";
import { grab } from "utils/entityUtils";

export default function useGrabReadingGroupMembership(id) {
  const readingGroupMembership = useSelector(state =>
    grab("readingGroupMemberships", id, state.entityStore)
  );
  const readingGroupMembershipResponse = useSelector(state =>
    get(state.entityStore.responses, requests.feReadingGroupMembershipShow)
  );

  return { readingGroupMembership, readingGroupMembershipResponse };
}
