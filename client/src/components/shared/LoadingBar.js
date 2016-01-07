import React, { Component } from 'react';

export default class LoadingBar extends Component {
  constructor(props) {
    super(props);
    this.state = { status: 0 };
  }

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
