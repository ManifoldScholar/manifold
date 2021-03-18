import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchReadingGroupAnnotations(
  match,
  filter,
  pagination
) {
  const dispatch = useDispatch();

  useEffect(() => {
    const rgAnnotationsFetch = readingGroupsAPI.annotations(
      match.params.id,
      filter,
      pagination
    );
    const rgAnnotationsAction = request(
      rgAnnotationsFetch,
      requests.feReadingGroupAnnotations
    );
    dispatch(rgAnnotationsAction);
  }, [dispatch, filter, pagination, match.params.id]);
}
