import React, { Component, PropTypes } from 'react';
// import {Link} from 'react-router';

export default class extends Component {

  static propTypes = {
    texts: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={'frontend-header'}>
        <div className={'logo'}></div>
      </div>
    );
  }
}

