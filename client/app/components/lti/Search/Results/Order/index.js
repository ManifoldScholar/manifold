import { useTranslation } from "react-i18next";
import IconComposer from "components/global/utility/IconComposer";
import useSearch from "hooks/useSearch";
import * as Styled from "./styles";

export default function Order() {
  const { t } = useTranslation();
  const {
    searchQueryState: { order },
    setQuery
  } = useSearch();

  const options = [
    { label: t("lti.order.recently_updated"), value: "updated" },
    { label: t("lti.order.recently_published"), value: "published" },
    { label: t("lti.order.alphabetical"), value: "alpha" }
  ];

  return (
    <Styled.Wrapper>
      <label htmlFor="order" className="screen-reader-text">
        {t("lti.order.label")}
      </label>
      <Styled.Select
        id="order"
        value={order}
        onChange={e => setQuery({ order: e.target.value })}
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

Order.propTypes = {};
