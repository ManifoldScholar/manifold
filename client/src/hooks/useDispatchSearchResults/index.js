import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchResultsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request, flush } = entityStoreActions;

export default function useDispatchSearchResults(queryParams, pagination) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (queryParams) {
      const query = { ...queryParams, page: pagination };
      const searchResultsFetch = searchResultsAPI.index(query);
      const searchResultsAction = request(
        searchResultsFetch,
        requests.rSearchResults
      );
      dispatch(searchResultsAction);
    }

    return () => dispatch(flush(requests.rSearchResults));
  }, [dispatch, queryParams, pagination]);
}
