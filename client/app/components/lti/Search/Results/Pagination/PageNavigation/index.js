import PropTypes from "prop-types";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import IconComposer from "components/global/utility/IconComposer";
import useSearch from "hooks/useSearch";
import * as Styled from "./styles";

const PageNavigation = ({ totalPages }) => {
  const { t } = useTranslation();
  const {
    query: { page },
    setPage
  } = useSearch();
  const pageInputRef = useRef(null);

  const handleSetPage = e => {
    if (e.key !== "Enter") return;

    const value = parseInt(pageInputRef.current?.value, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= totalPages) {
      setPage(value)();
    }
  };

  return (
    <Styled.Wrapper>
      {totalPages > 1 && (
        <Styled.NavButton
          type="button"
          onClick={setPage(page - 1)}
          disabled={page <= 1}
          aria-label={t("lti.pagination.previous_page")}
        >
          <IconComposer icon="arrowLongLeft16" size={24} />
        </Styled.NavButton>
      )}
      <Styled.PageInfo>
        <Styled.PageInput
          type="number"
          defaultValue={page}
          ref={pageInputRef}
          onKeyDown={handleSetPage}
          min={1}
          max={totalPages}
          aria-label={t("lti.pagination.current_page")}
        />
        <span>{t("lti.pagination.of_total", { totalPages })}</span>
      </Styled.PageInfo>
      {totalPages > 1 && (
        <Styled.NavButton
          type="button"
          onClick={setPage(page + 1)}
          disabled={page >= totalPages}
          aria-label={t("lti.pagination.next_page")}
        >
          <IconComposer icon="arrowLongRight16" size={24} />
        </Styled.NavButton>
      )}
    </Styled.Wrapper>
  );
};

PageNavigation.propTypes = {
  totalPages: PropTypes.number.isRequired
};

export default PageNavigation;
