import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import * as Styled from "./styles";

export default function SelectAll({
  pagination,
  unit,
  onSelect,
  onClear,
  allSelected
}) {
  const { t } = useTranslation();
  return (
    <Styled.Total role="status">
      <span>
        <Trans
          i18nKey={"counts.bulk_actions_match"}
          values={{ total: pagination.totalCount, unit }}
          components={[<Styled.Highlighted />]}
        />
      </span>
      <Styled.Select onClick={allSelected ? onClear : onSelect}>
        {allSelected ? t("actions.clear_selection") : t("actions.select_all")}
      </Styled.Select>
    </Styled.Total>
  );
}

SelectAll.displayName = "Backend.Annotations.BulkActions.SelectAll";

SelectAll.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired
  }).isRequired,
  unit: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  onClear: PropTypes.func,
  allSelected: PropTypes.bool.isRequired
};
