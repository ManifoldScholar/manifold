import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import ResourceImport from "backend/components/resource-import";

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
        this.props.fetch();
      }, 5000);
    }
  }

  updateImportState = state => {
    this.props.executeUpdate({ attributes: { state } });
  };

  render() {
    const { resourceImport } = this.props;
    const { importResults } = this.props.resourceImport.attributes;

    return (
      <div>
        <div className="form-secondary">
          <ResourceImport.Control
            resourceImport={resourceImport}
            updateImportState={this.updateImportState}
            fetch={this.props.fetch}
            match={this.props.match}
          />
          <div>
            <nav className="results-list">
              <ul>
                {importResults.map(r => {
                  return (
                    <ResourceImport.Result
                      resourceImportRow={r}
                      key={r.lineNumber}
                    />
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default connectAndFetch(ResourceImportResults);
