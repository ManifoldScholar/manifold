import { useSelector } from "react-redux";
import { grab } from "utils/entityUtils";

export default function useGrabCurrentTextSection(match) {
  return useSelector(state =>
    grab("textSections", match.params.sectionId, state.entityStore)
  );
}
