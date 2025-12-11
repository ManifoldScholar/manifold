import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class BackendPanel extends PureComponent {
  static displayName = "Layout.BackendPanel";

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    sidebar: PropTypes.object,
    flush: PropTypes.bool
  };

  get innerClass() {
    return classNames("container", {
      flush: this.props.flush
    });
  }

  render() {
    return (
      <div className="backend-panel">
        <div className={this.innerClass}>
          {this.props.sidebar}
          <div className="panel">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
