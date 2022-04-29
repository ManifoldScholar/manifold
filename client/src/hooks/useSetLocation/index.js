import { useEffect, useCallback } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

// Setting a default of {} or passing in an un-memoized empty object for filters will cause the container to exceed maximum depth. Leave undefined if no filters. --LD

export default function useSetLocation({ filters, page }) {
  const history = useHistory();
  const { pathname } = useLocation();

  const updateUrlFromState = useCallback(() => {
    const params =
      page === 1
        ? filters
        : {
            ...filters,
            page
          };
    const search = queryString.stringify(params);
    history.push({
      pathname,
      search
    });
  }, [filters, history, pathname, page]);

  useEffect(() => updateUrlFromState(), [updateUrlFromState]);
}
