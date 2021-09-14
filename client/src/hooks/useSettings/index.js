import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

export default function useSettings() {
  const settings = useSelector(state =>
    select(requests.settings, state.entityStore)
  );

  return settings;
}
