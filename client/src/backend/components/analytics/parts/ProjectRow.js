import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function ProjectRow({ id, attributes: { titleFormatted, subtitleFormatted } }) {
  const value = Math.floor(Math.random() * 100);
  return (
    <tr className="analytics-table__row">
      <td>
        <Link
          to={lh.link("backendProject", id)}
          className="analytics-table__link"
        >
          <span dangerouslySetInnerHTML={{ __html: titleFormatted }} />
          {subtitleFormatted && (
            <>
              {": "}
              <span
                dangerouslySetInnerHTML={{
                  __html: subtitleFormatted
                }}
              />
            </>
          )}
        </Link>
      </td>
      <td>{`${value}`}</td>
    </tr>
  );
}

ProjectRow.propTypes = {
  id: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired
};

ProjectRow.displayName = "Analytics.Block.Table.ProjectRow";

export default ProjectRow;
