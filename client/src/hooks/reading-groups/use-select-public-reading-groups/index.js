import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectPublicReadingGroups() {
  const readingGroups = useSelector(state =>
    select(requests.fePublicReadingGroups, state.entityStore)
  );
  const readingGroupsMeta = useSelector(state =>
    meta(requests.fePublicReadingGroups, state.entityStore)
  );

  return { readingGroups, readingGroupsMeta };
}
