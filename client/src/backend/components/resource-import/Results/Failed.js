import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ResourceImportResultsFailed extends PureComponent {
  static displayName = "ResourceImport.Results.Failed";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;

    return (
      <React.Fragment>
        <i className="manicon manicon-x small" aria-hidden="true" />
        <span>{`Row #${
          resourceImportRow.lineNumber
        } failed with errors.`}</span>
      </React.Fragment>
    );
  }
}
