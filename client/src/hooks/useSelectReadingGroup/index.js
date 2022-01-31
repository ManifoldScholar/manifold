import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectReadingGroup() {
  const readingGroup = useSelector(state =>
    select(requests.feReadingGroup, state.entityStore)
  );
  const readingGroupMeta = useSelector(state =>
    meta(requests.feReadingGroup, state.entityStore)
  );

  return { readingGroup, readingGroupMeta };
}
