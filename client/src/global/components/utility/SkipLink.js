import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class SkipLink extends PureComponent {
  static propTypes = {
    skipId: PropTypes.string,
    skipLinkText: PropTypes.string,
    skipMessage: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    skipId: "skip-to-main"
  };

  get skipLinkText() {
    return (
      this.props.skipLinkText ?? this.props.t("navigation.skip_to_main.link")
    );
  }

  get skipMessage() {
    return (
      this.props.skipMessage ?? this.props.t("navigation.skip_to_main.message")
    );
  }

  constructor(props) {
    super(props);
    this.state = { skipped: false };
  }

  activateSkipMessage = () => {
    this.setState({ skipped: true });
  };

  render() {
    return (
      <>
        <a
          className="skip-to-main"
          href={`#${this.props.skipId}`}
          onClick={this.activateSkipMessage}
        >
          {this.skipLinkText}
        </a>
        <span className="screen-reader-text" role="alert">
          {this.state.skipped && this.skipMessage}
        </span>
      </>
    );
  }
}

export default withTranslation()(SkipLink);
