import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { requests } from "api";
import { entityStoreActions } from "actions";
import { fixtures } from "helpers/storybook/exports";

const { request } = entityStoreActions;

const sampleData = fixtures.factory("volume");

export default function useDispatchVolume(match) {
  const dispatch = useDispatch();

  // useEffect(() => {
  // const journalVolumeRequest = request(
  //   journalVolumesAPI.show(match.params.id),
  //   requests.feJournalVolume
  // );
  //   dispatch(journalVolumeRequest);
  //   /* eslint-disable react-hooks/exhaustive-deps */
  // }, [
  //   match.params.id
  //   fetchVersion,
  // ]);

  useEffect(() => {
    const mockAction = {
      type: "API_RESPONSE",
      payload: { data: sampleData },
      meta: "journalVolume",
      error: false
    };
    dispatch(mockAction);
  }, [dispatch]);
}
