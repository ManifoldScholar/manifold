import React, { Component, PropTypes } from 'react';
import {
    HeaderNotifications,
    SearchMenuBody,
    SearchMenuButton,
    UIPanel,
    UserMenuBody,
    UserMenuButton,
    PressLogo
} from 'components/global';
import { Link } from 'react-router';
import startsWith from 'lodash/startsWith';
import get from 'lodash/get';
import HigherOrder from 'containers/global/HigherOrder';
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

  render() {
    const path = this.props.location.pathname;
    const active = startsWith(path, lh.frontendFollowing()) ? 'following' : 'browse';
    return (
      <header className={'header-app'}>
        <div className="header-container">
          <Link to={lh.frontend()} className="logo">
            <PressLogo url={get(this.props.settings, 'attributes.pressLogoStyles.small')}/>
          </Link>
          {/* Use show-50 utility class to hide text-nav on mobile */}
          <nav className="text-nav show-50">
            <ul>
              <li className={active === 'browse' ? 'active' : ''}>
                <Link to={lh.frontend()}>
                  {'Projects'}
                </Link>
              </li>
              <HigherOrder.RequireRole requiredRole="any">
                <li className={active === 'following' ? 'active' : ''}>
                  <Link to={lh.frontendFollowing()}>
                    {'Following'}
                  </Link>
                </li>
              </HigherOrder.RequireRole>
            </ul>
          </nav>

          <nav className="menu-dropdowns">
            <ul>
              <HigherOrder.RequireRole requiredRole="admin">
                <li>
                  <Link className="button-mode" to={lh.backend()}>
                    Admin Mode
                  </Link>
                </li>
              </HigherOrder.RequireRole>

              {/*
                Hiding search markup until functionality is available
                <li>
                  <SearchMenuButton
                    toggleSearchMenu={this.props.commonActions.toggleSearchPanel}
                    active={this.props.visibility.uiPanels.search}
                  />
                  <UIPanel
                    id="search"
                    visibility={this.props.visibility.uiPanels}
                    bodyComponent={SearchMenuBody}
                  />
                </li>
              */}
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
