import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SkipLink extends PureComponent {
  static defaultProps = {
    skipId: "skip-to-main",
    skipLinkText: "Skip to main content",
    skipMessage: "Skipped to Main Content"
  };

  static propTypes = {
    skipId: PropTypes.string,
    skipLinkText: PropTypes.string,
    skipMessage: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { skipped: false };
  }

  activateSkipMessage = () => {
    this.setState({ skipped: true });
  };

  render() {
    return (
      <React.Fragment>
        <a
          className="skip-to-main screen-reader-text"
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
