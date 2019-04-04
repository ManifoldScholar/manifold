import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ViewHeader extends PureComponent {
  static displayName = "Layout.ViewHeader";

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    return (
      <header className="backend-header">
        <div className="backend-header__inner">
          <h1 className="backend-header__title backend-header__title--large">
            {this.props.children}
          </h1>
        </div>
      </header>
    );
  }
}
