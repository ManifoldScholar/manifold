import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import Row from "./Row";
import RowSort from "./RowSort";
import EmptyRow from "./EmptyRow";
import { useTranslation } from "react-i18next";

function Table({
  headers,
  rows,
  rowComponent,
  allLink,
  pagination,
  paginationClickHandler,
  sortOptions,
  emptyMessageKey = "messages.no_results"
}) {
  const hasRows = !!rows?.length;
  const useSorting = hasRows && !!sortOptions?.length;
  const usePagination = hasRows && !!(pagination && paginationClickHandler);
  const RowComponent = rowComponent || Row;
  const defaultActiveState = useSorting ? sortOptions[0] : [];
  const [activeSortParam, setActiveSortParam] = useState(defaultActiveState);
  const { t } = useTranslation();

  function handleSortChange(value) {
    const selectedSort = sortOptions.find(option => option.value === value);
    setActiveSortParam(selectedSort);
  }

  return (
    <>
      {useSorting && (
        <RowSort
          options={sortOptions}
          active={activeSortParam}
          onChange={handleSortChange}
        />
      )}
      <table id="pagination-target" className="analytics-table">
        <thead className="analytics-table__header">
          <tr>
            {/* eslint-disable react/no-array-index-key */}
            {headers.map((header, index) => (
              <th key={index} scope="col">
                {header}
              </th>
            ))}
            {/* eslint-enable react/no-array-index-key */}
          </tr>
        </thead>
        <tbody>
          {!hasRows && <EmptyRow message={t(emptyMessageKey)} />}
          {hasRows &&
            rows.map(row => (
              <RowComponent key={RowComponent.generateId(row)} {...row} />
            ))}
        </tbody>
      </table>
      {usePagination && (
        <div className="analytics-block__footer">
          <Utility.Pagination
            pagination={pagination}
            paginationClickHandler={paginationClickHandler}
            paginationTarget="#pagination-target"
          />
        </div>
      )}
      {hasRows && allLink && (
        <div className="analytics-block__footer">
          <Link to={allLink} className="analytics-block__link">
            <span>{t("actions.see_all")}</span>
            <Utility.IconComposer icon="arrowLongRight16" size="default" />
          </Link>
        </div>
      )}
    </>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object.isRequired),
  rowComponent: PropTypes.elementType,
  allLink: PropTypes.string,
  pagination: PropTypes.object,
  paginationClickHandler: PropTypes.func,
  sortOptions: PropTypes.arrayOf(PropTypes.object.isRequired),
  emptyMessageKey: PropTypes.string
};

Table.displayName = "Analytics.Block.Table";

export default Table;
