import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function TextNodeRow({ id, depth, textSlug, anchor, label }) {
  const value = Math.floor(Math.random() * 100);
  return (
    <tr className="analytics-table__row">
      <td>
        <Link
          to={lh.link("readerSection", textSlug, id, `#${anchor || ""}`)}
          className={`analytics-table__link analytics-table__link--depth-${depth}`}
        >
          {label}
        </Link>
      </td>
      <td>{`${value}`}</td>
    </tr>
  );
}

TextNodeRow.propTypes = {
  id: PropTypes.string.isRequired,
  depth: PropTypes.number,
  textSlug: PropTypes.string.isRequired,
  anchor: PropTypes.string,
  label: PropTypes.string.isRequired
};

TextNodeRow.displayName = "Analytics.Block.Table.TextNodeRow";

export default TextNodeRow;
