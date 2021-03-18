import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroupMembers(id, filter, pagination) {
  const dispatch = useDispatch();

  useEffect(() => {
    const membersFetch = readingGroupsAPI.members(id, filter, pagination);
    const membersAction = request(membersFetch, requests.feReadingGroupMembers);
    dispatch(membersAction);
  }, [dispatch, id, filter, pagination]);
}
