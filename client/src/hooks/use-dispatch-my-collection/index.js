import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useDispatchMyCollection() {
  const dispatch = useDispatch();

  useEffect(() => {
    const myCollectionFetch = meAPI.myCollection();
    const myCollectionAction = request(
      myCollectionFetch,
      requests.feMyCollection
    );
    dispatch(myCollectionAction);
  }, [dispatch]);
}
