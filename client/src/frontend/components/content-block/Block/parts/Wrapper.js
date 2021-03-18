import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ContentBlockWrapper extends PureComponent {
  static displayName = "ContentBlock.Wrapper";

  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string,
    theme: PropTypes.oneOf(["default", "shaded", "box", "nested"]),
    nested: PropTypes.bool
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

  get nested() {
    return this.props.nested;
  }

  get outerClassName() {
    return classNames({
      "frontend-content-block": true,
      [`frontend-content-block--${this.theme}`]: !!this.theme
    });
  }

  get innerClassName() {
    return classNames({
      "entity-section-wrapper": true,
      container: !this.nested,
      flush: !this.nested
    });
  }

  render() {
    return (
      <section id={this.id} className={this.outerClassName}>
        <div className={this.innerClassName}>{this.props.children}</div>
      </section>
    );
  }
}
