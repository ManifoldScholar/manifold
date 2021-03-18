import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectReadingGroupAnnotations() {
  const annotations = useSelector(state =>
    select(requests.feReadingGroupAnnotations, state.entityStore)
  );
  const annotationsMeta = useSelector(state =>
    meta(requests.feReadingGroupAnnotations, state.entityStore)
  );

  return { annotations, annotationsMeta };
}
