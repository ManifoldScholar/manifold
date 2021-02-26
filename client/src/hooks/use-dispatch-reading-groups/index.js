import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroups() {
  const dispatch = useDispatch();

  useEffect(() => {
    const readingGroupsFetch = meAPI.readingGroups();
    const readingGroupsAction = request(
      readingGroupsFetch,
      requests.feMyReadingGroups
    );

    dispatch(readingGroupsAction);
  }, [dispatch]);
}
