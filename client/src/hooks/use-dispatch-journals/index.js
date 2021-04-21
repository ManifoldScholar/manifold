import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import queryString from "query-string";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

export default function useDispatchJournals(location) {
  const dispatch = useDispatch();

  useEffect(() => {
    const search = queryString.parse(location.search);
    const { page, ...filters } = search;
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };

    const journalsFetch = projectsAPI.index(
      { standaloneModeEnforced: false, ...filters },
      pagination
    );
    const journalsAction = request(journalsFetch, requests.feProjectsFiltered);
    const { promise: one } = dispatch(journalsAction);
    const promises = [one];
    Promise.all(promises);
  }, [dispatch, location]);
}
