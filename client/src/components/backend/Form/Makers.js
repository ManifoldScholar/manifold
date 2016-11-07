import React, { Component, PropTypes } from 'react';

export default class Makers extends Component {

  static displayName = "From.Makers";

  static propTypes = {
    label: PropTypes.string
  };

  render() {
    return (
      <div>
        {'Makers'}
      </div>
    );
  }

}
