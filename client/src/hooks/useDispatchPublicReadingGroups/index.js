import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroups(filter, page) {
  const dispatch = useDispatch();

  useEffect(() => {
    const readingGroupsFetch = readingGroupsAPI.publicIndex(filter, page);
    const readingGroupsAction = request(
      readingGroupsFetch,
      requests.fePublicReadingGroups
    );
    dispatch(readingGroupsAction);
  }, [dispatch, filter, page]);
}
