import { useSelector } from "react-redux";
import { requests } from "api";
import { grab, select } from "utils/entityUtils";

// TODO: revise once API is in place
export default function useSelectIssue(match) {
  const issueResponse = useSelector(state =>
    select("issue", state.entityStore)
  );
  const issue = useSelector(state =>
    grab("issues", match.params.id, state.entityStore)
  );
  return { issue: issueResponse, issueResponse };
}
