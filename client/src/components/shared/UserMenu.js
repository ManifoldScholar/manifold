import React, { Component, PropTypes } from 'react';
import { Dropdown } from '../../components/shared';
import { UserMenuButton } from './';
import { UserMenuBody } from './';

export default class UserMenu extends Component {

  static propTypes = {
    toggleUserMenu: PropTypes.func,
    hideUserMenu: PropTypes.func,
    showLoginOverlay: PropTypes.func,
    startLogout: PropTypes.func,
    authenticated: PropTypes.bool,
    visible: PropTypes.bool
  };

  render() {
    return (
      <Dropdown
        triggerComponent={UserMenuButton}
        bodyComponent={UserMenuBody}
      />
    );
  }
}
