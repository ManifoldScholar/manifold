import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

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
        <IconComposer
          icon="check16"
          size={18}
          iconClass="results-header__icon"
        />
        <span>
          {`Row #${resourceImportRow.lineNumber} ${verb} `}
          <Link to={lh.link("backendResource", resourceImportRow.resourceId)}>
            {resourceImportRow.resourceTitle}
          </Link>
          .
        </span>
      </React.Fragment>
    );
  }
}
