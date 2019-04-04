import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

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
        <IconComposer
          icon="arrowRight16"
          size={18}
          iconClass="results-header__icon"
        />
        <span>
          {`Row #${resourceImportRow.lineNumber} was skipped as marked.`}
        </span>
      </React.Fragment>
    );
  }
}
