import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { requests } from "api";
import { entityStoreActions } from "actions";
import { fixtures } from "helpers/storybook/exports";

const { request } = entityStoreActions;

const sampleData = fixtures.collectionFactory("journal", 1)[0];

export default function useDispatchJournal(match, fetchVersion) {
  const dispatch = useDispatch();
  const requestName = "feJournal";

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

  useEffect(() => {
    const mockAction = {
      type: "API_RESPONSE",
      payload: { data: sampleData },
      meta: "journal",
      error: false
    };
    dispatch(mockAction);
  }, [dispatch]);
}
