import React, { Component, PropTypes } from 'react';
import {
    AppearanceMenuButton,
    AppearanceMenuBody,
    VisibilityButton
} from 'components/reader';

export default class Footer extends Component {
  static propTypes = {
    visibility: PropTypes.object,
    commonActions: PropTypes.object
  };

  constructor() {
    super();
    this.handleAppearanceMenuButtonClick = this.handleAppearanceMenuButtonClick.bind(this);
    this.handleVisibilityButtonClick = this.handleVisibilityButtonClick.bind(this);
  }

  handleAppearanceMenuButtonClick() {
    this.props.commonActions.panelToggle('appearance');
  }

  handleVisibilityButtonClick() {
    this.props.commonActions.visibilityToggle('annotation');
  }

  render() {
    return (
      <footer className="reader-footer-menu">
        <div className="container">
          <nav className="menu-buttons">
            <ul>
              {/*
                These buttons are hidden until functionality is
                provided for them
                <li>
                  <button className="button-bookmarks">
                    <i className="manicon manicon-bookmark-outline"></i>
                    <span className="Click to see text bookmarks"></span>
                  </button>
                </li>
               */}
              <li>
                <AppearanceMenuButton
                  toggleAppearanceMenu={this.handleAppearanceMenuButtonClick}
                  active={this.props.visibility.uiPanels.appearance}
                />
              </li>
              <li>
                <VisibilityButton
                  toggle={this.handleVisibilityButtonClick}
                  state={this.props.visibility.annotation}
                />
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    );
  }
}
