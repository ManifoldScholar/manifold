import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ViewHeader extends PureComponent {
  static displayName = "Layout.ViewHeader";

  static propTypes = {
    icon: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    return (
      <header className="backend-header section-heading-secondary">
        <h1>
          {this.props.icon ? (
            <i
              className={`manicon manicon-${this.props.icon}`}
              aria-hidden="true"
            />
          ) : null}
          {this.props.children}
        </h1>
      </header>
    );
  }
}
