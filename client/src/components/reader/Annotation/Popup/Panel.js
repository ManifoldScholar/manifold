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

  constructor(props) {
    super(props);
    this.state = {
      tailHighlight: false
    };
  }

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

  handleTailHighlight = condition => {
    if (condition) {
      this.setState({
        tailHighlight: true
      });
    }
  };

  handleTailBlur = condition => {
    if (condition) {
      this.setState({
        tailHighlight: false
      });
    }
  };

  renderChild(child, position) {
    const additionalProps = {
      key: position
    };
    if (position === 0) {
      additionalProps.onMouseEnter = () => {
        this.handleTailHighlight(this.props.direction === "down");
      };
      additionalProps.onMouseLeave = () => {
        this.handleTailBlur(true);
      };
    }
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
      "popup-page": !this.isSecondary,
      "popup-page-secondary": this.isSecondary,
      hidden: this.isHidden,
      bottom: this.props.direction === "up",
      top: this.props.direction === "down"
    });

    const tailClass = classNames({
      tail: true,
      "tail-down": this.props.direction === "up",
      "tail-up": this.props.direction === "down",
      highlight: this.state.tailHighlight
    });

    return (
      <section className={pageClass} ref={this.setWrapperRef}>
        {this.renderChildren()}
        <div className={tailClass} />
      </section>
    );
  }
}
