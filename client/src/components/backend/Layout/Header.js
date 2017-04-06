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
import { linkHelpers as lh } from 'routes';

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

  classesFor(segment) {
    let active = false;
    const path = this.props.location.pathname;
    if (segment === "project" && path === `${lh.backend()}/`) active = true;
    if (startsWith(path, `${lh.backend()}/${segment}`)) active = true;
    return classNames({ active });
  }

  render() {
    return (
       <header className={'header-app dark'}>
          <div className="header-container">
            <Link to={lh.backend()} className="logo">
              <PressLogo
                url={get(this.props.settings, 'attributes.pressLogoStyles.small')}
              />
            </Link>
            <nav className="text-nav">
              <ul>
                <li className={this.classesFor('project')} >
                  <Link to={lh.backend()}>
                    {'Projects'}
                  </Link>
                </li>
                <li className={this.classesFor('people')} >
                  <Link to={lh.backendPeople()}>
                    {'People'}
                  </Link>
                </li>
                <li className={this.classesFor('settings')} >
                  <Link to={lh.backendSettings()}>
                    {'Settings'}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className="menu-dropdowns">
              <ul>
                <li className="show-60">
                  <Link className="button-mode" to={lh.frontend()}>
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
