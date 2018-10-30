import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ResourceImportResultsSkipped extends PureComponent {
  static displayName = "ResourceImport.Results.Skipped";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    return (
      <React.Fragment>
        <i className="manicon manicon-arrow-right small" aria-hidden="true" />
        <span>{`Row #${
          resourceImportRow.lineNumber
        } was skipped as marked.`}</span>
      </React.Fragment>
    );
  }
}
