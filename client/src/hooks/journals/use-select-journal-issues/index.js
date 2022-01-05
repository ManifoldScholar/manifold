import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta } from "utils/entityUtils";
import { fixtures } from "helpers/storybook/exports";
import shuffle from "lodash/shuffle";

// Mock data until we have the api
const sampleData = fixtures
  .collectionFactory("issue", 12)
  .map(issue => issue.data)
  .map(issue => {
    const color = shuffle(["primary", "secondary", "tertiary", "quinary"])[0];
    return {
      ...issue,
      attributes: { ...issue.attributes, avatarColor: color }
    };
  });

export default function useSelectJournalIssues() {
  // const issues = useSelector(state =>
  //   select(requests.issues, state.entityStore)
  // );
  // const issuesMeta = useSelector(state =>
  //   meta(requests.issuesMeta, state.entityStore)
  // );
  const issues = sampleData;
  const issuesMeta = {
    pagination: { totalCount: 12, perPage: 12, currentPage: 1 }
  };

  return { issues, issuesMeta };
}
