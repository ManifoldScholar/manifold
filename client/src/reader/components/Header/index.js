import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import ControlMenu from "reader/components/control-menu";
import Notes from "reader/components/notes";
import TextTitles from "reader/components/TextTitles";
import ReturnMenu from "reader/components/return-menu";
import SearchMenu from "global/components/search/menu";
import HeaderNotifications from "global/components/HeaderNotifications";
import UserMenuBody from "global/components/UserMenuBody";
import UserMenuButton from "global/components/UserMenuButton";
import UIPanel from "global/components/UIPanel";
import Layout from "reader/components/layout";
import memoize from "lodash/memoize";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import Utility from "global/components/utility";

import Authorize from "hoc/authorize";
import BlurOnLocationChange from "hoc/blur-on-location-change";

export default class Header extends Component {
  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    location: PropTypes.object,
    appearance: PropTypes.object,
    notifications: PropTypes.object,
    selectFont: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func,
    incrementMargins: PropTypes.func,
    decrementMargins: PropTypes.func,
    resetTypography: PropTypes.func,
    setColorScheme: PropTypes.func,
    scrollAware: PropTypes.object,
    commonActions: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object
  };

  get projectId() {
    if (!this.props.text) return null;
    return this.props.text.relationships.project.id;
  }

  get textId() {
    if (!this.props.text) return null;
    return this.props.text.id;
  }

  get sectionId() {
    if (!this.props.section) return null;
    return this.props.section.id;
  }

  handleContentsButtonClick = event => {
    event.stopPropagation();
    this.props.commonActions.panelToggle("tocDrawer");
  };

  triggerShowSignInUpOverlay = () => {
    this.props.commonActions.visibilityShow("signInUpOverlay");
  };

  handleVisibilityFilterChange = filters => {
    this.props.commonActions.visibilityChange({ visibilityFilters: filters });
  };

  panelToggleHandler = memoize(panel => {
    return () => {
      this.props.commonActions.panelToggle(panel);
    };
  });

  renderContentsButton = textAttrs => {
    if (textAttrs.toc.length <= 0 && isEmpty(textAttrs.metadata)) {
      return null;
    }

    const buttonIndexClass = classNames({
      "button-index": true,
      active: this.props.visibility.uiPanels.tocDrawer
    });

    return (
      <button
        className={buttonIndexClass}
        onClick={this.handleContentsButtonClick}
        aria-haspopup
        aria-expanded={this.props.visibility.uiPanels.tocDrawer}
      >
        <span className="button-index__text">Contents</span>
        <Utility.IconComposer
          icon="disclosureDown24"
          size="default"
          iconClass="button-index__icon"
        />
      </button>
    );
  };

  render() {
    const containerClass = classNames("container-banner", {
      border: this.props.scrollAware && !this.props.scrollAware.top
    });

    return (
      <BlurOnLocationChange location={this.props.location}>
        <header className="header-reader">
          <Utility.SkipLink />
          <Layout.PreHeader />
          <nav className={containerClass}>
            <ReturnMenu.Button
              toggleReaderMenu={this.panelToggleHandler("readerReturn")}
              expanded={this.props.visibility.uiPanels.readerReturn}
            />
            {this.renderContentsButton(this.props.text.attributes)}
            {this.props.section ? (
              <TextTitles
                textTitle={this.props.text.attributes.titleFormatted}
                sectionTitle={this.props.section.attributes.name}
                showSection={!this.props.scrollAware.top}
              />
            ) : null}
            <div className="menu-buttons">
              <ul aria-label="Reader Settings and Search">
                <Authorize kind={"any"}>
                  <li>
                    <ControlMenu.NotesButton
                      toggle={this.panelToggleHandler("notes")}
                      active={this.props.visibility.uiPanels.notes}
                    />
                  </li>
                </Authorize>
                <li>
                  <ControlMenu.VisibilityMenuButton
                    toggle={this.panelToggleHandler("visibility")}
                    active={this.props.visibility.uiPanels.visibility}
                  />
                </li>
                <li>
                  <ControlMenu.AppearanceMenuButton
                    toggleAppearanceMenu={this.panelToggleHandler("appearance")}
                    active={this.props.visibility.uiPanels.appearance}
                  />
                </li>
                <li>
                  <SearchMenu.Button
                    toggleSearchMenu={this.panelToggleHandler("search")}
                    active={this.props.visibility.uiPanels.search}
                  />
                </li>
                <li>
                  <UserMenuButton
                    authentication={this.props.authentication}
                    active={this.props.visibility.uiPanels.user}
                    showLoginOverlay={this.triggerShowSignInUpOverlay}
                    toggleUserMenu={this.panelToggleHandler("user")}
                  />
                </li>
              </ul>
            </div>
          </nav>
          <div className="menu-panels-left">
            <UIPanel
              id="readerReturn"
              visibility={this.props.visibility.uiPanels}
              bodyComponent={ReturnMenu.Body}
              returnUrl={lh.link(
                "frontendProject",
                this.props.text.relationships.project.attributes.slug
              )}
              projectId={this.props.text.relationships.project.id}
              projectTitle={
                this.props.text.relationships.project.attributes.titlePlaintext
              }
              toggleSignInUpOverlay={
                this.props.commonActions.toggleSignInUpOverlay
              }
              hidePanel={this.props.commonActions.hideReaderReturnPanel}
              // TODO: More link (and eventually, the link text) should be pulled from settings
              moreLink="http://manifold.umn.edu/about/"
            />
          </div>

          <div className="menu-panels-right">
            <UIPanel
              id="notes"
              visibility={this.props.visibility.uiPanels}
              visible={this.props.visibility.uiPanels.notes}
              bodyComponent={Notes.ReaderDrawer}
              hidePanel={this.props.commonActions.hideNotesPanel}
            />
            <UIPanel
              id="visibility"
              visibility={this.props.visibility.uiPanels}
              filter={this.props.visibility.visibilityFilters}
              filterChangeHandler={this.handleVisibilityFilterChange}
              bodyComponent={ControlMenu.VisibilityMenuBody}
              hidePanel={this.props.commonActions.hideVisibilityPanel}
            />
            <UIPanel
              id="search"
              visibility={this.props.visibility.uiPanels}
              toggleVisibility={this.panelToggleHandler("search")}
              initialState={{
                keyword: "",
                scope: "text",
                allFacets: true
              }}
              projectId={this.projectId}
              textId={this.textId}
              sectionId={this.sectionId}
              searchType="reader"
              bodyComponent={SearchMenu.Body}
              hidePanel={this.props.commonActions.hideSearchPanel}
            />
            <UIPanel
              id="appearance"
              visibility={this.props.visibility.uiPanels}
              bodyComponent={ControlMenu.AppearanceMenuBody}
              // Props required by body component
              appearance={this.props.appearance}
              selectFont={this.props.selectFont}
              setColorScheme={this.props.setColorScheme}
              incrementFontSize={this.props.incrementFontSize}
              decrementFontSize={this.props.decrementFontSize}
              incrementMargins={this.props.incrementMargins}
              decrementMargins={this.props.decrementMargins}
              resetTypography={this.props.resetTypography}
              hidePanel={this.props.commonActions.hideAppearancePanel}
            />
            <UIPanel
              id="user"
              visibility={this.props.visibility.uiPanels}
              bodyComponent={UserMenuBody}
              // Props required by body component
              showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
              startLogout={this.props.commonActions.logout}
              hideUserMenu={this.props.commonActions.toggleUserPanel}
              hidePanel={this.props.commonActions.hideUserPanel}
            />
          </div>
          <HeaderNotifications />
        </header>
      </BlurOnLocationChange>
    );
  }
}
