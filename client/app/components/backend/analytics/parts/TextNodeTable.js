import React from "react";
import PropTypes from "prop-types";
import TextNodeRow from "./TextNodeRow";
import EmptyRow from "./EmptyRow";
import { useTranslation } from "react-i18next";

function flatten(node, depth) {
  /* eslint-disable no-param-reassign, func-names */
  depth++;
  return node.reduce(function(result, next) {
    next.depth = depth;
    result.push(next);
    if (next.children) {
      result = result.concat(flatten(next.children, depth));
    }
    return result;
  }, []);
}

function TextNodeTable({
  headers,
  rows,
  slug,
  emptyMessageKey = "messages.no_sections"
}) {
  const hasRows = !!rows?.length;
  const flattenedRows = hasRows ? flatten(rows, 0) : [];
  const { t } = useTranslation();

  return (
    <table className="analytics-table">
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
        {/* eslint-disable react/no-array-index-key */}
        {flattenedRows.map((row, i) => (
          <TextNodeRow
            key={`${i}_${row.id}#${row.anchor}`}
            textSlug={slug}
            {...row}
          />
        ))}
        {/* eslint-enable react/no-array-index-key */}
      </tbody>
    </table>
  );
}

TextNodeTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object.isRequired),
  slug: PropTypes.string,
  emptyMessageKey: PropTypes.string
};

TextNodeTable.displayName = "Analytics.Block.TextNodeTable";

export default TextNodeTable;
