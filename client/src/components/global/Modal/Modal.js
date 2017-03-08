import React, { PureComponent, PropTypes } from 'react';
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

