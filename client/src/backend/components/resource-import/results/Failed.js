import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceImportResultsFailed extends PureComponent {
  static displayName = "ResourceImport.Results.Failed";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;

    return (
      <React.Fragment>
        <IconComposer
          icon="close16"
          size={18}
          iconClass="results-header__icon"
        />
        <span>
          {`Row #${resourceImportRow.lineNumber} failed with errors.`}
        </span>
      </React.Fragment>
    );
  }
}
