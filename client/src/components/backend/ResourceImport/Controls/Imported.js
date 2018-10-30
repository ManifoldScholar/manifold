import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class ResourceImportControlsImported extends PureComponent {
  static displayName = "ResourceImport.Controls.Imported";

  static propTypes = {
    resourceImport: PropTypes.object,
    resetImport: PropTypes.func,
    finishUrl: PropTypes.string
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
          <Link to={this.props.finishUrl} className="button-icon-secondary">
            <i
              className="manicon manicon-arrow-left small"
              aria-hidden="true"
            />
            <span>Back to Resources</span>
          </Link>
          <button
            onClick={this.props.resetImport}
            className="button-icon-secondary dull"
          >
            <i className="manicon manicon-check small" aria-hidden="true" />
            <span>Reset Import</span>
          </button>
        </div>
      </React.Fragment>
    );
  }
}
