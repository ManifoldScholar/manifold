import React, { Component, PropTypes } from 'react';

export default class ResourceMarker extends Component {

  static propTypes = {
    ids: PropTypes.array,
    handleClick: PropTypes.func
  };

  render() {
    return (
      <span
        className="manicon manicon-cube-shine"
        data-resources={this.props.ids}
        onClick={this.props.handleClick}
      ></span>
    );
  }
}
