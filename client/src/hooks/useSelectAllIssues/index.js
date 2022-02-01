import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectAllIssues() {
  const issues = useSelector(state => select("issues", state.entityStore));
  const mockMeta = useSelector(state => meta("issues", state.entityStore));
  const issuesMeta = {
    ...mockMeta,
    pagination: { totalCount: 12, perPage: 12, currentPage: 1 }
  };

  return { issues, issuesMeta };
}
