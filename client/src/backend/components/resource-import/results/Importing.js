import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ResourceImportResultsImporting extends PureComponent {
  static displayName = "ResourceImport.Results.Importing";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    return (
      <React.Fragment>
        <i className="manicon manicon-plus small" aria-hidden="true" />
        <span>{`Row #${resourceImportRow.lineNumber} is being imported.`}</span>
      </React.Fragment>
    );
  }
}
