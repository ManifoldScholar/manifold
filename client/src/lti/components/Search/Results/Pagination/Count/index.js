import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useSearch from "hooks/useSearch";
import * as Styled from "./styles";

export default function Count({ totalCount }) {
  const { t, i18n } = useTranslation();
  const {
    query: { page, perPage }
  } = useSearch();
  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalCount);
  const formattedTotal = new Intl.NumberFormat(i18n.language).format(
    totalCount
  );

  return (
    <Styled.Count>
      <span aria-hidden>
        {t("lti.pagination.count", {
          count: totalCount,
          startItem,
          endItem,
          totalCount: formattedTotal
        })}
      </span>
      <span className="screen-reader-text">
        {t("lti.pagination.screen_reader_count", {
          count: totalCount,
          startItem,
          endItem,
          totalCount: formattedTotal
        })}
      </span>
    </Styled.Count>
  );
}

Count.propTypes = {
  totalCount: PropTypes.number.isRequired
};
