import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta, loaded } from "utils/entityUtils";
import { getRequestName } from "../helpers";

export default function useSelectAnnotations(groupId, context, filtered) {
  const groupType = groupId === "me" ? "me" : "group";
  const requestName = getRequestName(groupType, context, filtered);

  const annotations = useSelector(state =>
    select(requests[requestName], state.entityStore)
  );
  const annotationsMeta = useSelector(state =>
    meta(requests[requestName], state.entityStore)
  );
  const annotationsLoaded = useSelector(state =>
    loaded(requests[requestName], state.entityStore)
  );

  return { annotations, annotationsMeta, annotationsLoaded };
}
