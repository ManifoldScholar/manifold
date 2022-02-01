import { useEffect } from "react";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

export default function useSetUrlParamsFromState(location, filterState, page) {
  const history = useHistory();

  function updateUrlFromState() {
    const { pathname } = location;
    const params = { ...filterState, page };
    const search = queryString.stringify(params);
    history.push({ pathname, search });
  }

  useEffect(
    () => updateUrlFromState(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(filterState), page]
  );
}
