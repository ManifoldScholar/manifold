import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function ProjectRow({ projectId, projectTitle, viewCount }) {
  return (
    <tr className="analytics-table__row">
      <td>
        <Link
          to={lh.link("backendProject", projectId)}
          className="analytics-table__link"
        >
          <span dangerouslySetInnerHTML={{ __html: projectTitle }} />
        </Link>
      </td>
      <td>{`${viewCount.toLocaleString()}`}</td>
    </tr>
  );
}

ProjectRow.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectTitle: PropTypes.string.isRequired,
  viewCount: PropTypes.number.isRequired
};

ProjectRow.generateId = project => project.projectId;

ProjectRow.displayName = "Analytics.Block.Table.ProjectRow";

export default ProjectRow;
