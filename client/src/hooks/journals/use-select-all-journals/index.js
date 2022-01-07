import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";
import { fixtures } from "helpers/storybook/exports";
import shuffle from "lodash/shuffle";

// Mock data until we have the api
const sampleData = fixtures.collectionFactory("journal", 12).map(journal => {
  const color = shuffle(["primary", "secondary", "tertiary", "quinary"])[0];
  return {
    ...journal,
    attributes: { ...journal.attributes, avatarColor: color }
  };
});

export default function useSelectAllJournals() {
  // const journals = useSelector(state =>
  //   select(requests.journals, state.entityStore)
  // );
  // const journalsMeta = useSelector(state =>
  //   meta(requests.journalsMeta, state.entityStore)
  // );
  const journals = sampleData;
  console.log(sampleData);
  const journalsMeta = {
    pagination: { totalCount: 12, perPage: 12, currentPage: 1 }
  };

  return { journals, journalsMeta };
}
