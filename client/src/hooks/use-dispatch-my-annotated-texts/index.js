import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchMyAnnotatedTexts() {
  const dispatch = useDispatch();

  useEffect(() => {
    const myAnnotatedTextsFetch = meAPI.annotatedTexts();
    const myAnnotatedTextsAction = request(
      myAnnotatedTextsFetch,
      requests.feMyAnnotatedTexts
    );
    dispatch(myAnnotatedTextsAction);
  }, [dispatch]);
}
