import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SkipLink extends PureComponent {
  static propTypes = {
    skipId: PropTypes.string,
    skipLinkText: PropTypes.string,
    skipMessage: PropTypes.string
  };

  static defaultProps = {
    skipId: "skip-to-main",
    skipLinkText: "Skip to main content",
    skipMessage: "Skipped to Main Content"
  };

  constructor() {
    super();
    this.state = { skipped: false };
  }

  activateSkipMessage = () => {
    this.setState({ skipped: true });
  };

  render() {
    return (
      <React.Fragment>
        <a
          className="screen-reader-text"
          href={`#${this.props.skipId}`}
          onClick={this.activateSkipMessage}
        >
          {this.props.skipLinkText}
        </a>
        {this.state.skipped ? (
          <span className="screen-reader-text" role="alert">
            {this.props.skipMessage}
          </span>
        ) : null}
      </React.Fragment>
    );
  }
}
