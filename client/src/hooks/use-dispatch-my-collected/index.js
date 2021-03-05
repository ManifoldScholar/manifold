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

export default function useDispatchMyCollected(entity, page) {
  const dispatch = useDispatch();

  const requestName = getRequestName(entity);
  // eslint-disable-next-line no-console
  if (!requestName) return console.error(`"${entity}" is not a valid request.`);

  useEffect(() => {
    const myCollectionFetch = meAPI.myCollected(entity, page);
    const myCollectionAction = request(
      myCollectionFetch,
      requests[requestName]
    );
    dispatch(myCollectionAction);
  }, [dispatch, entity, page]);
}
