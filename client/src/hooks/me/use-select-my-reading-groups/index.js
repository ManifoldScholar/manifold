import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectMyReadingGroups() {
  const readingGroups = useSelector(state =>
    select(requests.feMyReadingGroups, state.entityStore)
  );
  const readingGroupsMeta = useSelector(state =>
    meta(requests.feMyReadingGroups, state.entityStore)
  );

  return { readingGroups, readingGroupsMeta };
}
