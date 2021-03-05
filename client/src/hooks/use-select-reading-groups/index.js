import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

export default function useSelectReadingGroups() {
  const groups = useSelector(state =>
    select(requests.feMyReadingGroups, state.entityStore)
  );
  return groups || [];
}
