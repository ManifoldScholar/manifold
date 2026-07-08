import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import { requests } from "api";
import useSearch from "hooks/search/useSearch";

const { flush } = entityStoreActions;

export default function useFacets({ formRef }) {
  const { setQuery } = useSearch();
  const dispatch = useDispatch();
  const [facetsCleared, setFacetsCleared] = useState(false);
  const pendingFacetsRef = useRef(null);

  const setFacets = next => {
    if (!next.length) {
      setFacetsCleared(true);
      // Strip the facets param from the URL so the address bar matches the
      // cleared UI, but bypass React Router so we don't trigger a refetch.
      const url = new URL(window.location.href);
      url.searchParams.delete("facets");
      window.history.replaceState(null, "", url);
      dispatch(flush(requests.gSearchResults));
      return;
    }
    setFacetsCleared(false);
    pendingFacetsRef.current = next;
    if (formRef.current) formRef.current.requestSubmit();
  };

  const onSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Prefer the pending facets set by a checkbox toggle; fall back to the
    // form's checked facets for a plain keyword submit.
    const facets = pendingFacetsRef.current ?? formData.getAll("facets");
    pendingFacetsRef.current = null;
    if (facetsCleared && !facets.length) return;
    const path = event.currentTarget.getAttribute("action");
    setQuery({ keyword: formData.get("keyword") ?? "", facets }, path);
  };

  return { facetsCleared, setFacets, onSubmit };
}
