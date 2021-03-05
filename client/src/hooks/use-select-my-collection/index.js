import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

export default function useSelectMyCollection() {
  const collection = useSelector(state =>
    select(requests.feMyCollection, state.entityStore)
  );
  return collection;
}
