import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { entityUtils } from 'utils';

export default class PressLogo extends Component {
  static propTypes = {
    url: PropTypes.string,
  };

  getDefaultIcon() {
    return (
      <div>
        <i className="manicon manicon-manifold-logo"></i>
        <span className="screen-reader-text">
          {'Manifold Logo: Click to return to the browse page'}
        </span>
      </div>
    );
  }

  getPressImage() {
    return (
      <div className="image" style={{ backgroundImage: `url(${this.props.url})` }} />
    );
  }

  render() {
    const figureClass = classNames({
      'logo-square': this.props.url
    });

    return (
      <figure className={figureClass}>
        {this.props.url ? this.getPressImage() : this.getDefaultIcon()}
      </figure>
    );
  }
}
