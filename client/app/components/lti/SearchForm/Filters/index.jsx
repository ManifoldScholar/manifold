import { useTranslation } from "react-i18next";
import FilterToggle from "./FilterToggle";
import { PRIMARY_FACETS, SECONDARY_FACETS } from "routes/lti/search/filters";
import { camelize } from "lib/utils/humps";
import * as Styled from "./styles";

export default function Filters({ value, onChange }) {
  const { t } = useTranslation();

  const toggle = v => {
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  const renderToggle = facet => (
    <FilterToggle
      key={facet}
      type={camelize(facet)}
      checked={value.includes(facet)}
      onChange={() => toggle(facet)}
    />
  );

  return (
    <fieldset>
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
    </fieldset>
  );
}
