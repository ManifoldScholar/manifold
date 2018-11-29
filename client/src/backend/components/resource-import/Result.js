import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ResourceImport from "backend/components/resource-import";

export default class ResourceImportResult extends PureComponent {
  static displayName = "ResourceImport.Result";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  renderKind(kind) {
    if (!kind) return null;
    return (
      <div className="results-secondary">
        <span>{kind}</span>
      </div>
    );
  }

  renderErrors(errors) {
    if (!errors || errors.length === 0) return null;
    return (
      <div className="results-desc">
        {errors.join("; ")}
        {"."}
      </div>
    );
  }

  renderHeader(resourceImportRow) {
    switch (resourceImportRow.state) {
      case "importing":
        return (
          <ResourceImport.Results.Importing
            resourceImportRow={resourceImportRow}
          />
        );
      case "failed":
        return (
          <ResourceImport.Results.Failed
            resourceImportRow={resourceImportRow}
          />
        );
      case "queued":
        return (
          <ResourceImport.Results.Queued
            resourceImportRow={resourceImportRow}
          />
        );
      case "pending":
        return (
          <ResourceImport.Results.Pending
            resourceImportRow={resourceImportRow}
          />
        );
      case "imported":
        return (
          <ResourceImport.Results.Imported
            resourceImportRow={resourceImportRow}
          />
        );
      case "skipped":
        return (
          <ResourceImport.Results.Skipped
            resourceImportRow={resourceImportRow}
          />
        );
      default:
        return `Row #${resourceImportRow.lineNumber}: ${
          resourceImportRow.state
        }`;
    }
  }

  render() {
    const { resourceImportRow } = this.props;
    if (!resourceImportRow) return null;

    return (
      <li className={`state-${resourceImportRow.state}`}>
        <div className="results-body">
          <h4 className="results-header">
            {this.renderHeader(resourceImportRow)}
            {this.renderErrors(resourceImportRow.errors)}
          </h4>
        </div>
        {this.renderKind(resourceImportRow.resourceKind)}
      </li>
    );
  }
}
