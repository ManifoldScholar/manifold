import React, { Component, PropTypes } from 'react';
import { SignInUp } from 'components/global';

export default class CreateUpdate extends Component {
  render() {
    return (
      <SignInUp.UpdateForm mode="new" {...this.props} />
    );
  }
}
