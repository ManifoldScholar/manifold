import { useState } from "react";

export default function useControlled({ query = {}, setQuery }) {
  const [keyword, setKeyword] = useState("");
  const [facetsCleared, setFacetsCleared] = useState(false);

  const setFacets = next => {
    if (!next.length) {
      setFacetsCleared(true);
      return;
    }
    setFacetsCleared(false);
    setQuery({ ...query, facets: next, page: { ...query.page, number: 1 } });
  };

  const onSubmit = event => {
    event.preventDefault();
    const currentFacets = query?.facets ?? [];
    if (facetsCleared && !currentFacets.length) return;
    setQuery({ ...query, keyword, page: { ...query.page, number: 1 } });
  };

  return { keyword, setKeyword, facetsCleared, setFacets, onSubmit };
}
