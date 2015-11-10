import React, { Component } from 'react';

export default class extends Component {

  render() {

    const sum = () => {
      return this.props.exampleCollection.reduce((memo, num) => {
        return memo + num;
      }, 0);
    };

    return (
      <div className={'frontend-header'}>
        <div className={'logo'}></div>
        <div className={'example'}>Store Sum: {sum()}</div>
      </div>
    );
  }
}
