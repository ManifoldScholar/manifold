import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import config from "../../../config";

export default class IngestionConnectionError extends PureComponent {
  static propTypes = {
    close: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="ingestion-error">
        <header className="dialog-header-small">
          <h2>Fatal Ingestion Error</h2>
        </header>
        {config.cableUrl
          ? <p>
              {"The client application is unable to connect to the server's websocket. " +
                'Please ensure that Manifold\'s "cable" service is available at the ' +
                "following location:"}
              <br />
              <br />
              <em>
                {config.cableUrl}
              </em>
            </p>
          : <p>
              {"The CABLE_URL environment variable has not been set correctly. Please " +
                "contact the administrator of this Manifold instance to correct this."}
            </p>}
        <p>
          {"After the problem has been corrected, this ingestion can be resumed at the " +
            "current URL."}
        </p>
        <button
          onClick={this.props.close}
          className="button-icon-secondary dull"
        >
          <i className="manicon manicon-x small" />
          Close
        </button>
      </div>
    );
  }
}
