import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroupCategories(id, fetchVersion) {
  const dispatch = useDispatch();

  useEffect(() => {
    const categoryFetch = readingGroupsAPI.categories(id);
    const categoryAction = request(
      categoryFetch,
      requests.feReadingGroupCategories
    );
    dispatch(categoryAction);
  }, [dispatch, id, fetchVersion]);
}
