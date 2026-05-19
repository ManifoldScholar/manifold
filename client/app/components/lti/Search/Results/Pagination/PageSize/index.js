import { useTranslation } from "react-i18next";
import IconComposer from "components/global/utility/IconComposer";
import useSearch from "hooks/useSearch";
import * as Styled from "./styles";

export default function PageSize() {
  const { t } = useTranslation();
  const {
    query: { perPage },
    setPerPage
  } = useSearch();
  const options = [20, 40, 60, 100];

  return (
    <Styled.Wrapper>
      <label htmlFor="pageSize">{t("lti.pagination.per_page_label")}</label>
      <Styled.Select
        id="pageSize"
        value={perPage}
        onChange={e => setPerPage(e.target.value)}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Styled.Select>
      <Styled.Icon>
        <IconComposer icon="disclosureDown16" size={16} />
      </Styled.Icon>
    </Styled.Wrapper>
  );
}

PageSize.propTypes = {};
