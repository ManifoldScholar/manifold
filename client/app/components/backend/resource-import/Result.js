import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Results from "./results";
import { withTranslation } from "react-i18next";

class ResourceImportResult extends PureComponent {
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
    const { t } = this.props;

    switch (resourceImportRow.state) {
      case "importing":
        return <Results.Importing resourceImportRow={resourceImportRow} />;
      case "failed":
        return <Results.Failed resourceImportRow={resourceImportRow} />;
      case "queued":
        return <Results.Queued resourceImportRow={resourceImportRow} />;
      case "pending":
        return <Results.Pending resourceImportRow={resourceImportRow} />;
      case "imported":
        return <Results.Imported resourceImportRow={resourceImportRow} />;
      case "skipped":
        return <Results.Skipped resourceImportRow={resourceImportRow} />;
      default:
        return t("resources.import.result_row", {
          num: resourceImportRow.lineNumber,
          state: resourceImportRow.state
        });
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

export default withTranslation()(ResourceImportResult);
