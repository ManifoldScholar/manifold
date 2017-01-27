import React, { Component, PropTypes } from 'react';
import {
    HeaderNotifications,
    HigherOrder,
    UIPanel,
    UserMenuBody,
    UserMenuButton,
    PressLogo
} from 'components/global';
import { Link } from 'react-router';
import startsWith from 'lodash/startsWith';
import classNames from 'classnames';
import get from 'lodash/get';

export default class LayoutHeader extends Component {

  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object,
    settings: PropTypes.object
  };

  isPath(segment) {
    const path = this.props.location.pathname;
    if (segment === "projects" && path === "/backend/") return true;
    return startsWith(path, `/backend/${segment}`);
  }

  classesFor(segment) {
    let active = false;
    const path = this.props.location.pathname;
    if (segment === "project" && path === "/backend/") active = true;
    if (startsWith(path, `/backend/${segment}`)) active = true;
    return classNames({ active });
  }

  render() {
    return (
       <header className={'header-app dark'}>
          <div className="header-container">
            <Link to={'/browse'} className="logo">
              <PressLogo url={get(this.props.settings, 'attributes.pressLogoUrl')}/>
            </Link>
            <nav className="text-nav">
              <ul>
                <li className={this.classesFor('project')} >
                  <Link to={`/backend/`}>
                    {'Projects'}
                  </Link>
                </li>
                <li className={this.classesFor('users')} >
                  <Link to={`/backend/users/`}>
                    {'Users'}
                  </Link>
                </li>
                <li className={this.classesFor('settings')} >
                  <Link to={`/backend/settings/`}>
                    {'Settings'}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className="menu-dropdowns">
              <ul>
                <li className="show-60">
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
