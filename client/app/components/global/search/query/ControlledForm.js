import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { scopeToPatch } from "hooks/useSearch/helpers";
import KeywordInput from "./KeywordInput";
import CheckboxMixed from "./CheckboxMixed";
import ScopeRadios from "./ScopeRadios";

export default function ControlledSearchQueryForm({
  query,
  onQueryChange,
  onSubmit,
  placeholder,
  autoFocus,
  facets,
  facetLabel,
  scopes,
  scopeLabel,
  className
}) {
  const { t } = useTranslation();
  const keyword = query?.keyword ?? "";
  const facetValues = query?.facets ?? [];
  const scopeValue = query?.scope ?? "";

  const handleSubmit = event => {
    event.preventDefault();
    if (onSubmit) onSubmit(event);
  };

  const update = next => onQueryChange({ ...query, ...next, page: 1 });

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <KeywordInput
        inputProps={{
          name: "keyword",
          value: keyword,
          onChange: event => update({ keyword: event.target.value })
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        showClear={!!keyword}
        onClear={() => update({ keyword: "" })}
      />
      {!!scopes?.length && (
        <ScopeRadios
          label={scopeLabel ?? t("search.scopes_label")}
          scopes={scopes}
          value={scopeValue}
          onChange={next => update(scopeToPatch(next, scopes))}
        />
      )}
      {!!facets?.length && (
        <CheckboxMixed
          label={facetLabel ?? t("search.result_types_label")}
          checkboxes={facets}
          value={facetValues}
          onChange={next => update({ facets: next })}
        />
      )}
    </form>
  );
}

ControlledSearchQueryForm.displayName = "Search.Query.ControlledForm";

ControlledSearchQueryForm.propTypes = {
  query: PropTypes.object,
  onQueryChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  facets: PropTypes.array,
  facetLabel: PropTypes.string,
  scopes: PropTypes.array,
  scopeLabel: PropTypes.string,
  className: PropTypes.string
};
