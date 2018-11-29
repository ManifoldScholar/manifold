import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class FormUploadEmpty extends PureComponent {
  static propTypes = {
    accepts: PropTypes.object,
    placeholder: PropTypes.string,
    progress: PropTypes.string,
    uploadError: PropTypes.string
  };

  static defaultProps = {
    placeholder: "cover"
  };

  get extensions() {
    if (!this.props.accepts || !this.props.accepts.extensions) return null;
    return this.props.accepts.extensions;
  }

  render() {
    return (
      <div className="contents-empty">
        <i className="manicon manicon-cloud-up" aria-hidden="true" />
        <div className="message">
          <p className="primary">
            {this.props.progress ? (
              <span>
                {"Uploading file to Manifold."}
                <br />
                {this.props.progress}
                {"% Complete."}
              </span>
            ) : (
              <React.Fragment>
                <span className="fake-link" role="button" tabIndex="0">
                  {"Upload a file"}
                </span>
                {" or "}
                <br />
                {"drag and drop here"}
                <br />
                {this.props.uploadError ? (
                  <span className="error">{this.props.uploadError}</span>
                ) : null}
              </React.Fragment>
            )}
          </p>
          {this.extensions ? (
            <p className="secondary">{this.extensions}</p>
          ) : null}
        </div>
      </div>
    );
  }
}
