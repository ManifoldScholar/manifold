import { useTranslation } from "react-i18next";
import IconComposer from "components/global/utility/IconComposer";
import useSearch from "hooks/useSearch";
import * as Styled from "./styles";

export default function Sort() {
  const { t } = useTranslation();
  const {
    searchQueryState: { sort },
    setQuery
  } = useSearch();

  const options = [
    { label: t("lti.sort.recently_updated"), value: "updated" },
    { label: t("lti.sort.recently_published"), value: "published" },
    { label: t("lti.sort.alphabetical"), value: "alpha" }
  ];

  return (
    <Styled.Wrapper>
      <label htmlFor="sort" className="screen-reader-text">
        {t("lti.sort.label")}
      </label>
      <Styled.Select
        id="sort"
        value={sort}
        onChange={e => setQuery({ sort: e.target.value })}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Styled.Select>
      <Styled.Icon>
        <IconComposer icon="disclosureDown16" size={16} />
      </Styled.Icon>
    </Styled.Wrapper>
  );
}

Sort.propTypes = {};
