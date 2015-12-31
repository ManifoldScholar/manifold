import React, { Component, PropTypes } from 'react';
import { TocDrawer, AppearanceMenuButton, AppearanceMenuBody } from './';
import { UIPanel, UserMenuButton, UserMenuBody } from '../../components/shared';
import { Link } from 'react-router';

import classNames from 'classnames';

export default class Header extends Component {

  static propTypes = {
    text: PropTypes.object,
    authenticated: PropTypes.bool,
    visibility: PropTypes.object,
    appearance: PropTypes.object,
    visibilityToggle: PropTypes.func,
    visibilityHide: PropTypes.func,
    visibilityShow: PropTypes.func,
    panelToggle: PropTypes.func,
    panelHide: PropTypes.func,
    selectFont: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func,
    startLogout: PropTypes.func
  };

  renderContentsButton = (contents) => {
    if (contents.length <= 0) {
      return null;
    }

    const buttonIndexClass = classNames({
      'button-index': true,
      'active': this.props.visibility.tocDrawer,
    });

    return (
        <button className={buttonIndexClass} onClick={() => {this.props.visibilityToggle('tocDrawer');}}>
          {'Contents'}<i className="manicon manicon-caret-down"></i>
        </button>
    );
  };

  render = () => {
    return (
        <header className="header-reader">
          <nav className="container-banner">
            <Link to={`/browse/project/${this.props.text.relationships.project.data.id}`} >
              <button className="button-close" >
                <i className="manicon manicon-x"></i>
                  <span className="screen-reader-text">
                    {'Click to close reader'}
                  </span>
              </button>
            </Link>
            { this.renderContentsButton(this.props.text.attributes.toc) }
            <h2 className="title">
              {this.props.text.attributes.title}
            </h2>
            <nav className="menu-buttons">
              <ul>
                <li>
                  <AppearanceMenuButton
                    toggleAppearanceMenu={()=> {this.props.panelToggle('appearance');}}
                    active={this.props.visibility.uiPanels.appearance}
                  />
                </li>
                <li>
                  <UserMenuButton
                      authenticated={this.props.authenticated}
                      active={this.props.visibility.uiPanels.user}
                      showLoginOverlay={() => {this.props.visibilityShow('loginOverlay');}}
                      toggleUserMenu={() => {this.props.panelToggle('user');}}
                  />
                </li>
              </ul>
            </nav>
          </nav>
          <TocDrawer text={this.props.text} visible={this.props.visibility.tocDrawer} hideTocDrawer={() => {this.props.visibilityHide('tocDrawer');}} />
          <nav className="menu-panels">
            <UIPanel
              id="appearance"
              visibility={this.props.visibility.uiPanels}
              bodyComponent={AppearanceMenuBody}

              // Props required by body component
              appearance={this.props.appearance}
              selectFont={this.props.selectFont}
              incrementFontSize={this.props.incrementFontSize}
              decrementFontSize={this.props.decrementFontSize}
            />
            <UIPanel
                id="user"
                visibility={this.props.visibility.uiPanels}
                bodyComponent={UserMenuBody}

                // Props required by body component
                startLogout={this.props.startLogout}
            />
          </nav>
        </header>
    );
  };
}
