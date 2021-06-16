import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

const requestMap = {
  projects: "feMyCollectedProjects",
  texts: "feMyCollectedTexts",
  text_sections: "feMyCollectedTextSections",
  resource_collections: "feMyCollectedResourceCollections",
  resources: "feMyCollectedResources"
};

function getRequestName(entity) {
  return requestMap[entity];
}

export default function useDispatchMyCollected(entity, fetchVersion) {
  const dispatch = useDispatch();
  const requestName = getRequestName(entity);

  useEffect(() => {
    if (requestName) {
      const myCollectionFetch = meAPI.myCollected(entity);
      const myCollectionAction = request(
        myCollectionFetch,
        requests[requestName]
      );
      dispatch(myCollectionAction);
    }
  }, [dispatch, entity, fetchVersion, requestName]);
}
