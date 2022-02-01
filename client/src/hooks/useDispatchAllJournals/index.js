import { useEffect } from "react";
import { useDispatch } from "react-redux";
import omitBy from "lodash/omitBy";
import shuffle from "lodash/shuffle";
import { requests } from "api";
import { entityStoreActions } from "actions";
import { fixtures } from "helpers/storybook/exports";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 8;

const sampleData = fixtures.collectionFactory("journal", 12).map(journal => {
  const color = shuffle(["primary", "secondary", "tertiary", "quinary"])[0];
  return {
    ...journal,
    attributes: { ...journal.attributes, avatarColor: color }
  };
});

export default function useDispatchAllJournals(page, context, fetchVersion) {
  const dispatch = useDispatch();
  const requestName = "feJournalsList";
  const options = { visible: true, order: "position ASC" };
  const pagination = {
    number: page || defaultPage,
    size: perPage,
    collectionProjects: {
      number: 1,
      size: 4
    }
  };

  // useEffect(() => {
  //   const journalsFetch = journalsAPI.journals(options, pagination);
  //   const journalsAction = request(journalsFetch, requests[requestName]);
  //   dispatch(journalsAction);
  //   /* eslint-disable react-hooks/exhaustive-deps */
  // }, [
  //   dispatch,
  //   options,
  //   page,
  //   context,
  //   fetchVersion,
  // ]);

  useEffect(() => {
    const mockAction = {
      type: "API_RESPONSE",
      payload: { data: sampleData },
      meta: "journals",
      error: false
    };
    dispatch(mockAction);
  }, [dispatch]);
}
