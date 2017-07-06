import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HigherOrder } from 'components/global';

export default class Modal extends PureComponent {

  static defaultProps = {
    isOpen: false,
    backdropClosesModal: false
  }

  constructor(props) {
    super(props);
  }

  render() {
    // This component is a placeholder for the time being.
    return null;
  }

}

