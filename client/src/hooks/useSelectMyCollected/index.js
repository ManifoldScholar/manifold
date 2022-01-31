import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

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

export default function useSelectMyCollected(entity) {
  const requestName = getRequestName(entity) || "";

  const collection = useSelector(state =>
    select(requests[requestName], state.entityStore)
  );
  const collectionMeta = useSelector(state =>
    meta(requests[requestName], state.entityStore)
  );
  return { collection, collectionMeta };
}
