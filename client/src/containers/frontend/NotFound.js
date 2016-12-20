import React, { Component } from 'react';
import { FatalError } from 'components/global';

export default class NotFound extends Component {

  error() {
    return {
      status: 404,
      detail: "The URL you requested does not exist.",
      title: "Page Not Found."
    };
  }

  render() {
    return (
      <FatalError error={this.error()}/>
    );
  }
}
