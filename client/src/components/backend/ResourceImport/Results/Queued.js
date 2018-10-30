import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class ResourceImportResultsQueued extends PureComponent {
  static displayName = "ResourceImport.Results.Queued";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  renderMessage(resourceImportRow) {
    if (resourceImportRow.isUpdate) {
      return (
        <span>
          {`Row #${resourceImportRow.lineNumber} is queued to update `}
          <Link to={lh.link("backendResource", resourceImportRow.resourceId)}>
            {resourceImportRow.resourceTitle}
          </Link>.
        </span>
      );
    } else if (resourceImportRow.isSkip) {
      return (
        <span>
          {`Row #${resourceImportRow.lineNumber} will be skipped as marked.`}
        </span>
      );
    }
    return (
      <span>
        {`Row #${
          resourceImportRow.lineNumber
        } is queued to create a new resource.`}
      </span>
    );
  }

  renderIcon(resourceImportRow) {
    if (resourceImportRow.isSkip)
      return (
        <i className="manicon manicon-arrow-right small" aria-hidden="true" />
      );

    return <i className="manicon manicon-plus small" aria-hidden="true" />;
  }

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    return (
      <React.Fragment>
        {this.renderIcon(resourceImportRow)}
        {this.renderMessage(resourceImportRow)}
      </React.Fragment>
    );
  }
}
