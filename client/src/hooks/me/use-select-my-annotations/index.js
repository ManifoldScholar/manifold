import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectMyAnnotations() {
  const annotations = useSelector(state =>
    select(requests.feMyAnnotations, state.entityStore)
  );
  const annotationsMeta = useSelector(state =>
    meta(requests.feMyAnnotations, state.entityStore)
  );

  return { annotations, annotationsMeta };
}
