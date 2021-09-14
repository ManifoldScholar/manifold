import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";

export default class Panel extends PureComponent {
  static displayName = "Annotation.Popup.Panel";

  static propTypes = {
    primary: PropTypes.bool,
    visible: PropTypes.bool,
    direction: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    name: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.panelRef = React.createRef();
  }

  get isPrimary() {
    return this.props.primary === true;
  }

  get isSecondary() {
    return !this.isPrimary;
  }

  componentDidMount() {
    setTimeout(() => {
      const firstInteractiveEl = this.panelRef.current.querySelector(
        "button, [href], [tabindex]"
      );
      if (!firstInteractiveEl) return;
      firstInteractiveEl.focus();
    }, 200);
  }

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
      "annotation-popup__panel--bottom": this.props.direction === "up",
      "annotation-popup__panel--top": this.props.direction === "down"
    });

    const tailClass = classNames({
      "annotation-popup__tail": true,
      "annotation-popup__tail--down": this.props.direction === "up",
      "annotation-popup__tail--up": this.props.direction === "down",
      "annotation-popup__tail--dark": this.props.name === "readingGroups"
    });

    return (
      <CSSTransition
        in={this.props.visible}
        classNames="panel"
        appear
        timeout={{ appear: 300, exit: 300 }}
      >
        <section ref={this.panelRef} className={pageClass}>
          {this.renderChildren()}
          <div className={tailClass} />
        </section>
      </CSSTransition>
    );
  }
}
