import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchMyReadingGroups(filter, page) {
  const dispatch = useDispatch();

  useEffect(() => {
    const myReadingGroupsFetch = meAPI.readingGroups(filter, page);
    const myReadingGroupsAction = request(
      myReadingGroupsFetch,
      requests.feMyReadingGroups
    );
    dispatch(myReadingGroupsAction);
  }, [dispatch, filter, page]);
}
