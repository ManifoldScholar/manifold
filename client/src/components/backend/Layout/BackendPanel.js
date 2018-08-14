import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class BackendPanel extends PureComponent {
  static displayName = "Layout.BackendPanel";

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    return (
      <div className="backend-panel">
        <div className="container">{this.props.children}</div>
      </div>
    );
  }
}
