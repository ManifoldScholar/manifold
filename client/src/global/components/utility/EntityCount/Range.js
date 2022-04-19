import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import * as Styled from "./styles";

function getRangeValues(pagination) {
  const { perPage, currentPage, totalCount } = pagination;
  let start = perPage * (currentPage - 1);
  if (totalCount > 0) start += 1;
  let end = totalCount < perPage ? totalCount : perPage * currentPage;
  if (end > totalCount) end = totalCount;

  return { start, end, totalCount };
}

function Range({ pagination, unit }) {
  const { start, end, totalCount } = getRangeValues(pagination);
  const { t } = useTranslation();
  return (
    <Styled.Total role="status">
      <span aria-hidden>
        <Trans
          i18nKey={"counts.range"}
          values={{ start, end, total: totalCount, unit }}
          components={[<Styled.Highlighted />]}
        />
      </span>
      <span className="screen-reader-text">
        {t("counts.range_sr", { total: totalCount, unit, start, end })}
      </span>
    </Styled.Total>
  );
}

Range.displayName = "Global.Utility.EntityCount.Range";

Range.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired
  }).isRequired,
  unit: PropTypes.string.isRequired
};

export default Range;
