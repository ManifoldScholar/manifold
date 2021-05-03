import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

export default function useSelectReadingGroupCategories() {
  return useSelector(state =>
    select(requests.feReadingGroupCategories, state.entityStore)
  );
}
