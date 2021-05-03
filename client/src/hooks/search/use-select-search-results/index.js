import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectReadingGroupAnnotations() {
  const results = useSelector(state =>
    select(requests.rSearchResults, state.entityStore)
  );
  const resultsMeta = useSelector(state =>
    meta(requests.rSearchResults, state.entityStore)
  );

  return { results, resultsMeta };
}
