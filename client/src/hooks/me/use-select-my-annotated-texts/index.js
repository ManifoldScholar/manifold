import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

export default function useSelectMyAnnotatedTexts() {
  const annotatedTexts = useSelector(state =>
    select(requests.feMyAnnotatedTexts, state.entityStore)
  );

  return annotatedTexts;
}
