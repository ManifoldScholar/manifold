import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

const requestMap = {
  projects: "feReadingGroupCollectedProjects",
  texts: "feReadingGroupCollectedTexts",
  text_sections: "feReadingGroupCollectedTextSections",
  resource_collections: "feReadingGroupCollectedResourceCollections",
  resources: "feReadingGroupCollectedResources"
};

function getRequestName(entity) {
  return requestMap[entity];
}

export default function useDispatchReadingGroupCollected(
  id,
  entity,
  fetchVersion
) {
  const dispatch = useDispatch();
  const requestName = getRequestName(entity);

  useEffect(() => {
    if (requestName) {
      const collectionFetch = readingGroupsAPI.collected(id, entity);
      const collectionAction = request(collectionFetch, requests[requestName]);
      dispatch(collectionAction);
    }
  }, [dispatch, id, entity, requestName, fetchVersion]);
}
