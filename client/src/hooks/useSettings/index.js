import { useSelector } from "react-redux";
import { requests } from "api";
import { select } from "utils/entityUtils";

// Returns the settings entity from the redux entityStore. Mirrors the shape
// the ported LTI components expect (settings.attributes.general.*). The
// settings request is fetched by the app shell (see frontend/lti containers).
export default function useSettings() {
  return useSelector(state => select(requests.settings, state.entityStore));
}
