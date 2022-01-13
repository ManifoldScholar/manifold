import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { requests } from "api";
import { entityStoreActions } from "actions";
import { fixtures } from "helpers/storybook/exports";

const { request } = entityStoreActions;

const sampleData = fixtures.collectionFactory("issue", 1)[0].data;

export default function useDispatchJournal(match, fetchVersion) {
  const dispatch = useDispatch();
  const requestName = "feIssue";

  // useEffect(() => {
  // const journalRequest = request(
  //   journalsAPI.show(match.params.id),
  //   requests.feJournal
  // );
  //   dispatch(journalRequest);
  //   /* eslint-disable react-hooks/exhaustive-deps */
  // }, [
  //   dispatch,
  //   match
  //   fetchVersion,
  // ]);

  console.log(sampleData);

  useEffect(() => {
    const mockAction = {
      type: "API_RESPONSE",
      payload: { data: sampleData },
      meta: "issue",
      error: false
    };
    dispatch(mockAction);
  }, [dispatch]);
}
