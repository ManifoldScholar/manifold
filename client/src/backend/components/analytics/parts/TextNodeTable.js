import React from "react";
import PropTypes from "prop-types";
import TextNodeRow from "./TextNodeRow";
import EmptyRow from "./EmptyRow";

function flatten(node, depth) {
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
  emptyMessage = "This text doesn’t contain any sections."
}) {
  const hasRows = !!rows?.length;
  const flattenedRows = hasRows ? flatten(rows, 0) : [];

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
        {!hasRows && <EmptyRow message={emptyMessage} />}
        {flattenedRows.map(row => (
          <TextNodeRow key={row.id} textSlug={slug} {...row} />
        ))}
      </tbody>
    </table>
  );
}

TextNodeTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object.isRequired),
  slug: PropTypes.string,
  emptyMessage: PropTypes.string
};

TextNodeTable.displayName = "Analytics.Block.TextNodeTable";

export default TextNodeTable;
