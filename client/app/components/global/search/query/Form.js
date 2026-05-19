import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import KeywordInput from "./KeywordInput";
import CheckboxMixed from "./CheckboxMixed";
import ScopeRadios from "./ScopeRadios";
import { useSearchQueryContext } from "./Context";

export default function SearchQueryForm({
  action,
  placeholder,
  autoFocus,
  facets,
  facetLabel,
  scopes,
  scopeLabel,
  className,
  children
}) {
  const { t } = useTranslation();
  const ctx = useSearchQueryContext("SearchQuery.Form");

  const defaultFacets = facets?.filter(f => f.default).map(f => f.value) ?? [];
  // Default to all checked when first landing on search form
  const selectedFacets = ctx.facets.value?.length
    ? ctx.facets.value
    : defaultFacets;
  // API treats [] as all, so we track if user explicitly cleared all
  // to sync filter state with returned results
  const facetValue = ctx.facets.cleared ? [] : selectedFacets;

  return (
    <form
      ref={ctx.formRef}
      action={action}
      method={action ? "get" : undefined}
      role="search"
      className={className}
      onSubmit={ctx.onSubmit}
    >
      <KeywordInput
        placeholder={placeholder}
        autoFocus={autoFocus}
        showClear={!!ctx.keyword.value}
        {...ctx.keyword}
      />
      {!!scopes?.length && (
        <ScopeRadios
          label={scopeLabel ?? t("search.scopes_label")}
          scopes={scopes}
          value={ctx.scope.value}
          onChange={next => ctx.scope.set(next, scopes)}
        />
      )}
      {!!facets?.length && (
        <CheckboxMixed
          label={facetLabel ?? t("search.result_types_label")}
          checkboxes={facets}
          value={facetValue}
          onChange={ctx.facets.set}
        />
      )}
      {children}
    </form>
  );
}

SearchQueryForm.displayName = "Search.Query.Form";

const exclusiveWith = (otherProp, baseValidator) => (
  props,
  propName,
  componentName,
  ...rest
) => {
  if (props[propName] != null && props[otherProp] != null) {
    return new Error(
      `\`${componentName}\` accepts either \`${propName}\` or \`${otherProp}\`, not both.`
    );
  }
  return baseValidator(props, propName, componentName, ...rest);
};

SearchQueryForm.propTypes = {
  action: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  facets: exclusiveWith("children", PropTypes.array),
  facetLabel: PropTypes.string,
  scopes: PropTypes.array,
  scopeLabel: PropTypes.string,
  className: PropTypes.string,
  children: exclusiveWith("facets", PropTypes.node)
};
