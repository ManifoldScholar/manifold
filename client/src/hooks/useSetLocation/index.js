import { useEffect, useCallback } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

export default function useSetLocation({ filters = {}, page }) {
  const history = useHistory();
  const { pathname } = useLocation();

  const updateUrlFromState = useCallback(() => {
    const params = {
      ...filters,
      page
    };
    const search = queryString.stringify(params);
    history.push({
      pathname,
      search
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => updateUrlFromState(), [JSON.stringify(filters), page]); // eslint-disable-line react-hooks/exhaustive-deps
}
