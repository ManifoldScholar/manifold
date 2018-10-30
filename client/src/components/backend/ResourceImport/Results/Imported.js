import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class ResourceImportResultsImported extends PureComponent {
  static displayName = "ResourceImport.Results.Imported";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    const verb = resourceImportRow.isUpdate ? "updated" : "created";

    return (
      <React.Fragment>
        <i className="manicon manicon-check small" aria-hidden="true" />
        <span>
          {`Row #${resourceImportRow.lineNumber} ${verb} `}
          <Link to={lh.link("backendResource", resourceImportRow.resourceId)}>
            {resourceImportRow.resourceTitle}
          </Link>.
        </span>
      </React.Fragment>
    );
  }
}
