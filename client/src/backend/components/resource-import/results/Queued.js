import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceImportResultsQueued extends PureComponent {
  static displayName = "ResourceImport.Results.Queued";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  get icon() {
    return this.props.resourceImportRow.isSkip ? "arrowRight16" : "plus16";
  }

  renderMessage(resourceImportRow) {
    if (resourceImportRow.isUpdate) {
      return (
        <span>
          {`Row #${resourceImportRow.lineNumber} is queued to update `}
          <Link to={lh.link("backendResource", resourceImportRow.resourceId)}>
            {resourceImportRow.resourceTitle}
          </Link>
          .
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

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    return (
      <React.Fragment>
        <IconComposer
          icon={this.icon}
          size={18}
          iconClass="results-header__icon"
        />
        {this.renderMessage(resourceImportRow)}
      </React.Fragment>
    );
  }
}
