import { useSelector } from "react-redux";
import { requests } from "api";
import { grab, select } from "utils/entityUtils";
import { fixtures } from "helpers/storybook/exports";

export default function useSelectJournal(match) {
  const journalResponse = useSelector(state =>
    select("journal", state.entityStore)
  );
  const baseJournal = useSelector(state =>
    grab("journals", match.params.id, state.entityStore)
  );

  // Update when we have the api for volume
  const volume = fixtures.collectionFactory("volume", 1)[0];
  const journal = baseJournal
    ? {
        ...baseJournal,
        relationships: { volumes: [volume] }
      }
    : null;
  return { journal, journalResponse };
}
