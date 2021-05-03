import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

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

export default function useSelectReadingGroupCollected(entity) {
  const requestName = getRequestName(entity) || "";

  return useSelector(state => select(requests[requestName], state.entityStore));
}
