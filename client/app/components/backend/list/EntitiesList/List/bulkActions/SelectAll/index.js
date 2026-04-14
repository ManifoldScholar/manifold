import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { getRangeValues } from "global/components/utility/EntityCount/Range";
import * as Styled from "./styles";

export default function SelectAll({
  pagination,
  unit,
  onSelect,
  onClear,
  onSelectPage,
  allSelected,
  idsSelectedCount
}) {
  const { t } = useTranslation();

  const hasSelection = allSelected || !!idsSelectedCount;

  const { start, end, totalCount } = pagination
    ? getRangeValues(pagination)
    : {};
  const pageCount = end - start + 1;
  const unpaginated = pagination?.totalPages === 1;

  // Valid because page change resets bulk selection
  const allPageSelected = idsSelectedCount === pageCount;

  /* eslint-disable no-nested-ternary */
  const ariaState = allPageSelected
    ? "true"
    : idsSelectedCount
    ? "mixed"
    : "false";

  return (
    <>
      <Styled.Total role="status">
        <span>
          <Trans
            i18nKey={"counts.range"}
            values={{ start, end, total: totalCount, unit }}
            components={[<Styled.Highlighted />]}
          />
        </span>
        {!allPageSelected && !allSelected && (
          <Styled.Select aria-pressed={ariaState} onClick={onSelectPage}>
            {t("actions.select_all")}
          </Styled.Select>
        )}
        {hasSelection && !allSelected && (
          <Styled.Select onClick={onClear}>
            {t("actions.clear_selection")}
          </Styled.Select>
        )}
      </Styled.Total>
      {!unpaginated && (allPageSelected || allSelected) && (
        <Styled.All>
          <span>
            <Trans
              i18nKey={"counts.bulk_actions_match"}
              values={{
                total: idsSelectedCount || pagination.totalCount,
                unit
              }}
              components={[<Styled.Highlighted />]}
            />
          </span>
          {!allSelected ? (
            <Styled.Select onClick={onSelect}>
              {t("actions.select_all_matching", { count: totalCount, unit })}
            </Styled.Select>
          ) : (
            <Styled.Select onClick={onClear}>
              {t("actions.clear_selection")}
            </Styled.Select>
          )}
        </Styled.All>
      )}
    </>
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
