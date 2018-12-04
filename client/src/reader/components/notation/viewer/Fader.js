import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class NotationFader extends PureComponent {
  static displayName = "NotationViewer.Fader";

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  componentDidUpdate() {
    if (!this.wrapper) return;
    const rect = this.wrapper.getBoundingClientRect();
    const visible =
      rect.top > 75 && rect.top + rect.height / 2 < window.innerHeight;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({ visible });
  }

  render() {
    const { children } = this.props;
    const classes = classNames("notation-preview-fader", {
      "transition-out": !this.state.visible,
      "transition-in": this.state.visible
    });

    return (
      <div
        className={classes}
        ref={r => {
          this.wrapper = r;
        }}
      >
        {children}
      </div>
    );
  }
}
