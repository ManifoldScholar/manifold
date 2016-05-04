import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class HeaderNotification extends Component {
  static propTypes = {
    id: PropTypes.string,
    heading: PropTypes.string,
    body: PropTypes.string,
    level: PropTypes.number,
    removeNotification: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  // Close notification in handler in case event access is required
  handleClose() {
    this.props.removeNotification(this.props.id);
  }

  bodyCopy() {
    let output = null;
    if (this.props.body) {
      output = (
        <p className="notification-body">
          {this.props.body}
        </p>
      );
    }

    return output;
  }

  render() {
    const notificationClass = classNames({
      'header-notification': true,
      notice: this.props.level === 0,
      warning: this.props.level === 1,
      error: this.props.level === 2
    });
    return (
      <div className={notificationClass} key={this.props.id}>
        <header>
          <h5 className="notification-heading">{this.props.heading}</h5>
        </header>
        {this.bodyCopy()}

        <button className="notification-close" onClick={this.handleClose}>
          <i className="manicon manicon-x"></i>
          <span className="screen-reader-text">{'Click to close this notification'}</span>
        </button>
      </div>
    );
  }
}
