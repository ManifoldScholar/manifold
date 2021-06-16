import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroup(id) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (id === "me") return;
    const readingGroupFetch = readingGroupsAPI.show(id);
    const readingGroupAction = request(
      readingGroupFetch,
      requests.feReadingGroup
    );
    dispatch(readingGroupAction);
  }, [dispatch, id]);
}
