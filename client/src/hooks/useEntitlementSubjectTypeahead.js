import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { searchResultsAPI } from "api";
import optionToValue from "helpers/entitlementSubjectUrl";

const FACETS = ["Journal", "Project"];

const optionToLabel = result => result.attributes.title;

export default function useEntitlementSubjectTypeahead() {
  const [keyword, setKeyword] = useState("");

  const updateOptions = useMemo(
    () =>
      debounce(word => {
        if (!word) return;
        setKeyword(word);
      }, 300),
    []
  );
  useEffect(() => () => updateOptions.cancel(), [updateOptions]);

  const options = useCallback(
    () => searchResultsAPI.index({ keyword, facets: FACETS }),
    [keyword]
  );

  return { options, updateOptions, optionToLabel, optionToValue };
}
