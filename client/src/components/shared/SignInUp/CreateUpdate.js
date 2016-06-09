import React, { Component, PropTypes } from 'react';
import { Errorable } from '../Form';
import UpdateForm from './UpdateForm';

export default class CreateUpdate extends Component {

  render() {
    return (
      <UpdateForm mode="new" {...this.props} />
    );
  }
}
