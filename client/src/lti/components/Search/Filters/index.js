import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import FilterToggle from "./FilterToggle";
import { useSearchQueryContext } from "global/components/search/query/Context";
import {
  PRIMARY_FACETS,
  SECONDARY_FACETS,
  resolveFacets
} from "lti/containers/Search/filters";
import { camelize } from "utils/humps";
import * as Styled from "./styles";

export default function Filters() {
  const { t } = useTranslation();
  const location = useLocation();
  const { facets } = useSearchQueryContext("Filters");

  const urlFacets = resolveFacets(location.search);
  const value = facets.cleared ? [] : urlFacets;

  const toggle = v => {
    if (value.includes(v)) {
      facets.set(value.filter(x => x !== v));
    } else {
      facets.set([...value, v]);
    }
  };

  const renderToggle = facet => (
    <FilterToggle
      key={facet}
      name="facets"
      value={facet}
      type={camelize(facet)}
      checked={value.includes(facet)}
      onChange={() => toggle(facet)}
    />
  );

  return (
    <Styled.Fieldset>
      <Styled.Legend>{t("lti.search.results_include")}</Styled.Legend>
      <Styled.Row>
        {PRIMARY_FACETS.map(renderToggle)}
        <details>
          <Styled.Disclosure
            forwardedAs="summary"
            size="sm"
            background="neutral"
            postIcon="disclosureDown24"
            label={
              <>
                <span data-label-more>{t("lti.search.more")}</span>
                <span data-label-less>{t("lti.search.less")}</span>
              </>
            }
          />
          <Styled.Row>{SECONDARY_FACETS.map(renderToggle)}</Styled.Row>
        </details>
      </Styled.Row>
    </Styled.Fieldset>
  );
}
