import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";
import useSearch from "hooks/useSearch";

export default function useFacets({ formRef }) {
  const { setQuery } = useSearch();
  const navigation = useNavigation();
  const [facetsCleared, setFacetsCleared] = useState(false);
  const [awaitingResults, setAwaitingResults] = useState(false);
  const pendingFacetsRef = useRef(null);

  // Since clearing facets blocks form submission, wait to hide
  // the facets cleared message until we have new results
  useEffect(() => {
    if (!facetsCleared) return;

    if (navigation.state === "loading") return setAwaitingResults(true);
    if (navigation.state === "idle" && awaitingResults) {
      setAwaitingResults(false);
      setFacetsCleared(false);
    }
  }, [navigation.state, awaitingResults, facetsCleared]);

  const setFacets = next => {
    if (!next.length) {
      setFacetsCleared(true);
      setAwaitingResults(false);
      // If "everything" is unchecked,
      // strip the facets param from the URL so the address bar matches the
      // cleared UI, but bypass React Router so we don't trigger a loader run.
      const url = new URL(window.location.href);
      url.searchParams.delete("facets");
      window.history.replaceState(null, "", url);
      return;
    }
    pendingFacetsRef.current = next;
    if (formRef.current) formRef.current.requestSubmit();
  };

  const onSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Handle cases where checking/unchecking "everything" isn't
    // in sync with formData
    const facets = pendingFacetsRef.current ?? formData.getAll("facet");
    pendingFacetsRef.current = null;
    if (facetsCleared && !facets.length) return;
    const path = event.currentTarget.getAttribute("action");
    setQuery({ keyword: formData.get("keyword") ?? "", facets }, path);
  };

  return { facetsCleared, setFacets, onSubmit };
}
