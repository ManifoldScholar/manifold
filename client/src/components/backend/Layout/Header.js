import React, { Component, PropTypes } from 'react';
import {
    HeaderNotifications,
    HigherOrder,
    UIPanel,
    UserMenuBody,
    UserMenuButton
} from 'components/global';
import { Link } from 'react-router';
import startsWith from 'lodash/startsWith';

export default class LayoutHeader extends Component {

  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object
  };

  render() {
    const path = this.props.location.pathname;
    const active = startsWith(path, '/backend/users') ? 'users' : 'projects';
    return (
       <header className={'header-app dark'}>
          <div className="header-container">
            <Link to={'/browse'} className="logo">
              <figure>
                <i className="manicon manicon-manifold-logo"></i>
                <span className="screen-reader-text">
                  {'Manifold Logo: Click to return to the browse page'}
                </span>
              </figure>
            </Link>
            <nav className="text-nav">
              <ul>
                <li className={active === 'projects' ? 'active' : ''}>
                  <Link to={`/backend/`}>
                    {'Projects'}
                  </Link>
                </li>
                <li className={active === 'users' ? 'active' : ''}>
                  <Link to={`/backend/users/`}>
                    {'Users'}
                  </Link>
                </li>
                <li className={active === 'settings' ? 'active' : ''}>
                  <Link to={`/backend/settings/`}>
                    {'Settings'}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className="menu-dropdowns">
              <ul>
                <li>
                  <Link className="button-mode" to={`/browse`}>
                    Exit Admin Mode
                  </Link>
                </li>
                <li>
                  <UserMenuButton
                    authentication={this.props.authentication}
                    active={this.props.visibility.uiPanels.user}
                    showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
                    toggleUserMenu={this.props.commonActions.toggleUserPanel}
                  />
                  <UIPanel
                    id="user"
                    visibility={this.props.visibility.uiPanels}
                    bodyComponent={UserMenuBody}
                    showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
                    startLogout={this.props.commonActions.logout}
                    hideUserMenu={this.props.commonActions.toggleUserPanel}
                  />
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-border"></div>

          <HeaderNotifications
            notifications={this.props.notifications}
            addNotification={this.props.commonActions.addNotification}
            removeNotification={this.props.commonActions.removeNotification}
            removeAllNotifications={this.props.commonActions.clearNotifications}
          />
        </header>
    );
  }
}
