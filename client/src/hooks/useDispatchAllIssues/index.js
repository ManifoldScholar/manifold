import { useEffect } from "react";
import { useDispatch } from "react-redux";
import shuffle from "lodash/shuffle";
import { fixtures } from "helpers/storybook/exports";

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

export default function useDispatchAllIssues() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const issuesFetch = journalsAPI.issues(activeFilters, pagination);
  //   const issuesAction = request(issuesFetch, requests[requestName]);
  //   dispatch(issuesAction);
  //   /* eslint-disable react-hooks/exhaustive-deps */
  // }, [
  //   dispatch,
  //   activeFilters,
  //   page,
  //   context,
  //   fetchVersion,
  //   filtered
  // ]);

  useEffect(() => {
    const mockAction = {
      type: "API_RESPONSE",
      payload: { data: sampleData },
      meta: "issues",
      error: false
    };
    dispatch(mockAction);
  }, [dispatch]);
}
