import React, { Component } from 'react';

export default class LoadingBar extends Component {
  getInitialState = () => {
    return {
      status: 0
    };
  };

  bindKey = () => {

  };

  render = () => {
    this.bindKey();

    return (
        <div className="loading-bar">
          <div className="progress"></div>
        </div>
    );
  };
}
