import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

export default function useSelectSettings() {
  const settings = useSelector(state =>
    select(requests.settings, state.entityStore)
  );

  return { settings };
}
