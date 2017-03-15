import React, { PureComponent, PropTypes } from 'react';

export default class VisibilityButton extends PureComponent {

  static displayName = 'VisibilityButton';

  static propTypes = {
    toggle: PropTypes.func
  };

  render() {
    return (
      <button className="annotation-visibility-button" onClick={this.props.toggle}>
        <i className="manicon manicon-eye-fill"></i>
        <span className="screen-reader-text">
          Click to hide or show annotation/resources in the reader
        </span>
      </button>
    );
  }
}
