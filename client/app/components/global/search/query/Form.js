import { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useSearch from "hooks/useSearch";
import { scopeToPatch } from "hooks/useSearch/helpers";
import KeywordInput from "./KeywordInput";
import CheckboxMixed from "./CheckboxMixed";
import ScopeRadios from "./ScopeRadios";

const SearchQueryForm = forwardRef(function SearchQueryForm(
  {
    action,
    placeholder,
    autoFocus,
    facets,
    facetLabel,
    scopes,
    scopeLabel,
    className,
    onSubmit,
    children
  },
  ref
) {
  const { t } = useTranslation();
  const { searchQueryState, setQuery } = useSearch();
  const { keyword, facets: facetValues, scope: scopeValue } = searchQueryState;

  return (
    <form
      ref={ref}
      action={action}
      onSubmit={onSubmit}
      method="get"
      role="search"
      className={className}
    >
      <KeywordInput
        inputKey={keyword}
        inputProps={{ name: "keyword", defaultValue: keyword }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        showClear={!!keyword}
        onClear={() => setQuery({ keyword: "" })}
      />
      {!!scopes?.length && (
        <ScopeRadios
          label={scopeLabel ?? t("search.scopes_label")}
          scopes={scopes}
          value={scopeValue ?? ""}
          onChange={next => setQuery(scopeToPatch(next, scopes))}
        />
      )}
      {!!facets?.length && (
        <CheckboxMixed
          label={facetLabel ?? t("search.result_types_label")}
          checkboxes={facets}
          value={facetValues}
          onChange={next => setQuery({ facets: next })}
        />
      )}
      {children}
    </form>
  );
});

SearchQueryForm.displayName = "Search.Query.Form";

export default SearchQueryForm;

SearchQueryForm.propTypes = {
  action: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  facets: PropTypes.array,
  facetLabel: PropTypes.string,
  scopes: PropTypes.array,
  scopeLabel: PropTypes.string,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};
