import React, { Component, PropTypes } from 'react';
import { entityUtils } from 'utils';

export default class PressLogo extends Component {
  static propTypes = {
    url: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    if (this.props.url) {
      const style = {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        backgroundImage: `url(${this.props.url})`,
        width: '39px',
        height: '39px'
      };
      return (
        <figure style={this.props.style} className="" >
          <div style={style} />
        </figure>
      );
    }
    return (
      <figure>
        <i className="manicon manicon-manifold-logo"></i>
        <span className="screen-reader-text">
                {'Manifold Logo: Click to return to the browse page'}
              </span>
      </figure>
    );
  }
}
