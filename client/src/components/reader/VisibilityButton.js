import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';

export default class VisibilityButton extends PureComponent {

  static displayName = 'VisibilityButton';

  static propTypes = {
    toggle: PropTypes.func,
    state: PropTypes.number
  };

  render() {
    const buttonClass = classNames({
      'annotation-visibility-button': true,
      'primary': this.props.state === 1,
      'secondary': this.props.state === 2,
    });

    return (
      <button className={buttonClass}
        onClick={this.props.toggle}
      >
        <i className="manicon manicon-eye-fill"></i>
        <span className="screen-reader-text">
          Click to hide or show annotation/resources in the reader
        </span>
      </button>
    );
  }
}
