import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export class ResourceImportResults extends PureComponent {
  static displayName = "ResourceImport.Results";

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    executeUpdate: PropTypes.func.isRequired,
    resourceImport: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.maybeStartMonitoring(this.props.resourceImport);
  }

  componentDidUpdate() {
    this.maybeStartMonitoring(this.props.resourceImport);
    this.maybeStopMonitoring(this.props.resourceImport);
  }

  componentWillUnmount() {
    this.stopMonitoring();
  }

  maybeStopMonitoring(resourceImport) {
    const { state } = resourceImport.attributes;
    if (state !== "importing" && this.resourceImportRefresh) {
      this.stopMonitoring();
    }
  }

  stopMonitoring() {
    clearInterval(this.resourceImportRefresh);
    this.resourceImportRefresh = null;
  }

  maybeStartMonitoring(resourceImport) {
    const { state } = resourceImport.attributes;
    if (state === "importing" && !this.resourceImportRefresh) {
      this.resourceImportRefresh = setInterval(() => {
        this.refreshResults();
      }, 5000);
    }
  }

  finishUrl() {
    const { match } = this.props;
    return lh.link("backendProjectResources", match.params.projectId);
  }

  backLinkUrl() {
    const { match } = this.props;
    return lh.link(
      "backendResourceImportMap",
      match.params.projectId,
      match.params.id
    );
  }

  updateImportState(state) {
    this.props.executeUpdate({ attributes: { state } });
  }

  resetImport = event => {
    event.preventDefault();
    this.updateImportState("mapped");
  };

  startImport = event => {
    event.preventDefault();
    this.updateImportState("importing");
  };

  refreshResults = () => {
    this.props.fetch();
  };

  renderRowStateIcon(state) {
    if (state === "imported") {
      return <i className="manicon manicon-check small" aria-hidden="true" />;
    }
    if (state === "queued" || state === "importing") {
      return <i className="manicon manicon-plus small" aria-hidden="true" />;
    }
    if (state === "skipped") {
      return (
        <i className="manicon manicon-arrow-right small" aria-hidden="true" />
      );
    }
    if (state === "failed") {
      return <i className="manicon manicon-x small" aria-hidden="true" />;
    }
  }

  renderRowStateMessage(row) {
    if (row.state === "imported") {
      const verb = row.isUpdate ? "updated" : "created";
      return (
        <span>
          {`Row #${row.lineNumber} ${verb} `}
          <Link to={lh.link("backendResource", row.resourceId)}>
            {row.resourceTitle}
          </Link>.
        </span>
      );
    }
    if (row.state === "failed") {
      return <span>{`Row #${row.lineNumber} failed with errors.`}</span>;
    }
    if (row.state === "queued") {
      if (row.isUpdate) {
        return (
          <span>
            {`Row #${row.lineNumber} is queued to update `}
            <Link to={lh.link("backendResource", row.resourceId)}>
              {row.resourceTitle}
            </Link>.
          </span>
        );
      }
      return (
        <span>
          {`Row #${row.lineNumber} is queued to create a new resource.`}
        </span>
      );
    }
    if (row.state === "pending") {
      if (row.isUpdate) {
        return (
          <span>
            {`Row #${row.lineNumber} will update `}
            <Link to={lh.link("backendResource", row.resourceId)}>
              {row.resourceTitle}
            </Link>.
          </span>
        );
      }
      return (
        <span>{`Row #${row.lineNumber} will create a new resource.`}</span>
      );
    }
    if (row.state === "skipped") {
      return <span>{`Row #${row.lineNumber} is marked as skip.`}</span>;
    }
    if (row.state === "importing") {
      return <span>{`Row #${row.lineNumber} is being imported.`}</span>;
    }
    return `Row #${row.lineNumber}: ${row.state}`;
  }

  renderImporting() {
    return (
      <React.Fragment>
        <header className="form-section-label">
          <span>Step 4. Import Resources</span>
        </header>
        <p className="instructional-copy">
          The import is in progress. Each resource is updated in the background.
          This list below will refresh every 5 seconds, or you can press the
          refresh button to manually update the results.
        </p>

        <div
          className="buttons-icon-horizontal"
          style={{
            marginTop: 30,
            marginBottom: 0
          }}
        >
          <button
            onClick={this.refreshResults}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-check small" aria-hidden="true" />
            <span>Refresh Results</span>
          </button>
        </div>
      </React.Fragment>
    );
  }

  renderParsed() {
    return (
      <React.Fragment>
        <header className="form-section-label">
          <span>Step 4. Import Resources</span>
        </header>
        <p className="instructional-copy">
          {`The import is ready to begin. The list below is a preview of what will
          happen. Press the \u0022start import\u0022 button below to begin.`}
        </p>

        <div
          className="buttons-icon-horizontal"
          style={{
            marginTop: 30,
            marginBottom: 0
          }}
        >
          <button onClick={this.startImport} className="button-icon-secondary">
            <i className="manicon manicon-check small" aria-hidden="true" />
            <span>Start Import</span>
          </button>
          <Link to={this.backLinkUrl()} className="button-icon-secondary dull">
            <i
              className="manicon manicon-arrow-left small"
              aria-hidden="true"
            />
            <span>Back</span>
          </Link>
        </div>
      </React.Fragment>
    );
  }

  renderImported() {
    return (
      <React.Fragment>
        <header className="form-section-label">
          <span>Step 4. Import Resources</span>
        </header>
        <p className="instructional-copy">
          This import is complete. You may go back, edit the mapping, and rerun
          the import. Or, if the source is a google sheet, you can reset the
          import, which will allow you to make changes to mapping or source
          data, and then rerun the import.
        </p>

        <div
          className="buttons-icon-horizontal"
          style={{
            marginTop: 30,
            marginBottom: 0
          }}
        >
          <Link to={this.finishUrl()} className="button-icon-secondary">
            <i
              className="manicon manicon-arrow-left small"
              aria-hidden="true"
            />
            <span>Back to Resources</span>
          </Link>
          <button
            onClick={this.resetImport}
            className="button-icon-secondary dull"
          >
            <i className="manicon manicon-check small" aria-hidden="true" />
            <span>Reset Import</span>
          </button>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { resourceImport } = this.props;
    const { importResults } = this.props.resourceImport.attributes;

    return (
      <div>
        <div className="form-secondary">
          <div className="form-section">
            {(() => {
              switch (resourceImport.attributes.state) {
                case "importing":
                  return this.renderImporting();
                case "imported":
                  return this.renderImported();
                case "parsed":
                case "mapped":
                  return this.renderParsed();
                default:
                  return null;
              }
            })()}
            <div className="form-input">
              <nav className="results-list">
                <ul>
                  {importResults.map(r => {
                    return (
                      <li key={r.lineNumber} className={`state-${r.state}`}>
                        <div className="results-body">
                          <h4 className="results-header">
                            {this.renderRowStateIcon(r.state)}
                            {this.renderRowStateMessage(r)}
                          </h4>
                          {r.errors && r.errors.length > 0 ? (
                            <div className="results-desc">
                              {r.errors.join("; ")}
                              {"."}
                            </div>
                          ) : null}
                        </div>
                        {r.resourceKind ? (
                          <div className="results-secondary">
                            <span>{r.resourceKind}</span>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connectAndFetch(ResourceImportResults);
