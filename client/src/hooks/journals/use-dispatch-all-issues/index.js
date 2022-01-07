import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createAction } from "redux-actions";
import omitBy from "lodash/omitBy";
import shuffle from "lodash/shuffle";
import { requests } from "api";
import { entityStoreActions } from "actions";
import { fixtures } from "helpers/storybook/exports";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

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

export default function useDispatchAllIssues(
  filters,
  page,
  context,
  filtered,
  fetchVersion
) {
  const dispatch = useDispatch();
  const requestName = filtered ? "feIssuesListFiltered" : "feIssuesList";
  const baseFilters = {
    standaloneModeEnforced: false
  };
  const activeFilters = {
    ...omitBy(filters, value => value === ""),
    baseFilters
  };
  const pagination = {
    number: page || defaultPage,
    size: perPage
  };

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
