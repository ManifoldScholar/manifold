import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchMyAnnotations(filter, page) {
  const dispatch = useDispatch();

  useEffect(() => {
    const myAnnotationsFetch = meAPI.annotations(filter, page);
    const myAnnotationsAction = request(
      myAnnotationsFetch,
      requests.feMyAnnotations
    );
    dispatch(myAnnotationsAction);
  }, [dispatch, filter, page]);
}
