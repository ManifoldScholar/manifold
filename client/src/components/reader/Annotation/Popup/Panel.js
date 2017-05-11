import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';

export default class Panel extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tailHighlight: false
    };
  }

  handleTailHighlight = (condition) => {
    if (condition) {
      this.setState({
        tailHighlight: true
      });
    }
  };

  handleTailBlur = (condition) => {
    if (condition) {
      this.setState({
        tailHighlight: false
      });
    }
  };

  isPrimary() {
    return this.props.primary === true;
  }

  isSecondary() {
    return !this.isPrimary();
  }

  isHidden() {
    const { secondary, name } = this.props;
    if (isNil(secondary) && this.isPrimary()) return false;
    return !(!isNil(secondary) && this.isSecondary() && name === secondary);
  }

  renderChild(child, position) {
    const additionalProps = {
      key: position
    };
    if (position === 0) {
      additionalProps.onMouseEnter =
        () => { this.handleTailHighlight(this.props.direction === 'down'); };
      additionalProps.onMouseLeave =
        () => { this.handleTailBlur(true); };
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
      'popup-page': !this.isSecondary(),
      'popup-page-secondary': this.isSecondary(),
      hidden: this.isHidden(),
      bottom: this.props.direction === 'up',
      top: this.props.direction === 'down'
    });

    const tailClass = classNames({
      tail: true,
      'tail-down': this.props.direction === 'up',
      'tail-up': this.props.direction === 'down',
      highlight: this.state.tailHighlight
    });

    const style = {
      marginLeft: this.props.secondary ? -this.p.offsetWidth + 'px' : null
    };

    return (
      <section
        className={pageClass}
        ref={(p) => { this.p = p; }}
        style={style}
      >
        {this.renderChildren()}
        <div className={tailClass} />
      </section>
    );
  }

}
