import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ContentBlockWrapper extends PureComponent {
  static displayName = "ContentBlock.Wrapper";

  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string,
    theme: PropTypes.oneOf(["default", "shaded", "box"])
  };

  static defaultProps = {
    theme: "default"
  };

  get id() {
    return this.props.id;
  }

  get theme() {
    return this.props.theme;
  }

  render() {
    return (
      <section
        id={this.id}
        className={classNames({
          "frontend-content-block": true,
          [`frontend-content-block--${this.theme}`]: !!this.theme
        })}
      >
        <div className="container flush entity-section-wrapper">
          {this.props.children}
        </div>
      </section>
    );
  }
}
