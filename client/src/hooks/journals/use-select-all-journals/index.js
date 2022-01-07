import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";

export default function useSelectAllJournals() {
  const journals = useSelector(state => select("journals", state.entityStore));
  const mockMeta = useSelector(state => meta("journals", state.entityStore));
  const journalsMeta = {
    ...mockMeta,
    pagination: { totalCount: 12, perPage: 12, currentPage: 1 }
  };

  return { journals, journalsMeta };
}
