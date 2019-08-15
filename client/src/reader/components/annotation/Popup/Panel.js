import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class Panel extends PureComponent {
  static propTypes = {
    primary: PropTypes.bool,
    visible: PropTypes.bool,
    direction: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string
  };

  componentDidUpdate() {
    if (this.isPrimary && this.isHidden) {
      this.wrapperRef.style.marginLeft = -this.wrapperRef.offsetWidth + "px";
    } else {
      this.wrapperRef.style.marginLeft = "0px";
    }
  }

  get isPrimary() {
    return this.props.primary === true;
  }

  get isSecondary() {
    return !this.isPrimary;
  }

  get isHidden() {
    return !this.props.visible;
  }

  setWrapperRef = el => {
    this.wrapperRef = el;
  };

  renderChild(child, position) {
    const additionalProps = {
      key: position
    };
    return React.cloneElement(child, additionalProps);
  }

  renderChildren() {
    if (Array.isArray(this.props.children)) {
      const cleaned = this.props.children.filter(n => n);
      return cleaned.map((child, position) => {
        return this.renderChild(child, position);
      });
    }
    return this.renderChild(this.props.children, 0);
  }

  render() {
    const pageClass = classNames({
      "annotation-popup__panel": true,
      "annotation-popup__panel--secondary": this.isSecondary,
      "annotation-popup__panel--hidden": this.isHidden,
      "annotation-popup__panel--bottom": this.props.direction === "up",
      "annotation-popup__panel--top": this.props.direction === "down"
    });

    const tailClass = classNames({
      "annotation-popup__tail": true,
      "annotation-popup__tail--down": this.props.direction === "up",
      "annotation-popup__tail--up": this.props.direction === "down"
    });

    return (
      <section className={pageClass} ref={this.setWrapperRef}>
        {this.renderChildren()}
        <div className={tailClass} />
      </section>
    );
  }
}
