import React, { Component, PropTypes } from 'react';
import { Errorable } from '../Form';
import UpdateForm from './UpdateForm';

export default class Update extends Component {

  render() {
    return (
       <UpdateForm mode="existing" {...this.props} />
    );
  }
}
