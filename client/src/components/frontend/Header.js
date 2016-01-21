import React, { Component, PropTypes } from 'react';
import { UIPanel, SearchMenuButton, SearchMenuBody, UserMenuButton, UserMenuBody }
  from '../../components/shared';
import { Link } from 'react-router';
import { startsWith } from 'lodash/string';

export default class Header extends Component {

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authenticated: PropTypes.bool,
    visibilityToggle: PropTypes.func,
    visibilityHide: PropTypes.func,
    visibilityShow: PropTypes.func,
    panelToggle: PropTypes.func,
    panelHide: PropTypes.func,
    startLogout: PropTypes.func
  };

  toggleSearchPanel = () => {
    this.props.panelToggle('search');
  };

  toggleUserPanel = () => {
    this.props.panelToggle('user');
  };

  showLoginOverlay = () => {
    this.props.visibilityShow('loginOverlay');
  };

  render = () => {
    const path = this.props.location.pathname;
    const active = startsWith(path, '/browse/following') ? 'following' : 'browse';

    return (
      <header className={'header-browse'}>
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
            <li className={active === 'browse' ? 'active' : ''}>
              <Link to={`/browse/`}>
                {'Projects'}
              </Link>
            </li>
            <li className={active === 'following' ? 'active' : ''}>
              <Link to={`/browse/following/`}>
                {'Following'}
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="menu-dropdowns">
          <ul>
            <li>
              <SearchMenuButton
                toggleSearchMenu={this.toggleSearchPanel}
                active={this.props.visibility.uiPanels.search}
              />
              <UIPanel
                id="search"
                visibility={this.props.visibility.uiPanels}
                bodyComponent={SearchMenuBody}
              />
            </li>
            <li>
              <UserMenuButton
                authenticated={this.props.authenticated}
                active={this.props.visibility.uiPanels.user}
                showLoginOverlay={this.showLoginOverlay}
                toggleUserMenu={this.toggleUserPanel}
              />
              <UIPanel
                id="user"
                visibility={this.props.visibility.uiPanels}
                bodyComponent={UserMenuBody}

                // Props required by body component
                startLogout={this.props.startLogout}
                hideUserMenu={this.toggleUserPanel}
              />
            </li>
          </ul>
        </nav>
      </header>
    );
  };
}
