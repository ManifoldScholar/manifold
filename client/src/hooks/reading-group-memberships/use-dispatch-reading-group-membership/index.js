import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupMembershipsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroupMembership(id) {
  const dispatch = useDispatch();

  useEffect(() => {
    const membershipFetch = readingGroupMembershipsAPI.show(id);
    const membershipAction = request(
      membershipFetch,
      requests.feReadingGroupMembershipShow
    );
    dispatch(membershipAction);
  }, [dispatch, id]);
}
