import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class ResourceImportControlsParsed extends PureComponent {
  static displayName = "ResourceImport.Controls.Parsed";

  static propTypes = {
    resourceImport: PropTypes.object,
    backLinkUrl: PropTypes.string,
    startImport: PropTypes.func
  };

  render() {
    const resourceImport = this.props.resourceImport;
    if (!resourceImport) return null;

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
          <button
            onClick={this.props.startImport}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-check small" aria-hidden="true" />
            <span>Start Import</span>
          </button>
          <Link
            to={this.props.backLinkUrl}
            className="button-icon-secondary dull"
          >
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
}
