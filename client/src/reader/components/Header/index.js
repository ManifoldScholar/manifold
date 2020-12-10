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

  constructor(props) {
    super(props);

    this.resizeId = null;
    this.breakpoint = 560;
    this.state = {
      mobileOptionsExpanded: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

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

  handleOptionsToggleClick = () => {
    this.setState({
      mobileOptionsExpanded: !this.state.mobileOptionsExpanded
    });
  };

  handleResize = () => {
    if (this.resizeId) {
      window.cancelAnimationFrame(this.resizeId);
    }

    this.resizeId = window.requestAnimationFrame(() => {
      if (
        window.innerWidth < this.breakpoint ||
        !this.state.mobileOptionsExpanded
      )
        return null;

      this.setState({ mobileOptionsExpanded: false });
    });
  };

  renderOptionsToggle() {
    const { mobileOptionsExpanded } = this.state;

    return (
      <button
        onClick={this.handleOptionsToggleClick}
        aria-hidden
        tabIndex={-1}
        className="reader-header__button reader-header__button--pad-default reader-header__options-button"
      >
        {mobileOptionsExpanded ? "Close" : "Options"}
        {mobileOptionsExpanded && (
          <Utility.IconComposer
            icon="close32"
            size="default"
            iconClass="reader-header__options-button-icon"
          />
        )}
      </button>
    );
  }

  renderContentsButton = textAttrs => {
    if (textAttrs.toc.length <= 0 && isEmpty(textAttrs.metadata)) {
      return null;
    }

    const buttonClassName = classNames({
      "reader-header__button": true,
      "reader-header__button--gray": true,
      "reader-header__button--pad-default": true,
      "button-active": this.props.visibility.uiPanels.tocDrawer
    });

    return (
      <button
        className={buttonClassName}
        onClick={this.handleContentsButtonClick}
        aria-haspopup
        aria-expanded={this.props.visibility.uiPanels.tocDrawer}
      >
        <span className="reader-header__button-text">Contents</span>
        <Utility.IconComposer
          icon="disclosureDown24"
          size="default"
          iconClass="reader-header__button-icon reader-header__button-icon--large"
        />
        <Utility.IconComposer
          icon="disclosureDown16"
          size={20}
          iconClass="reader-header__button-icon reader-header__button-icon--small"
        />
      </button>
    );
  };

  render() {
    const innerClassName = classNames({
      "reader-header__inner": true,
      "reader-header__inner--shifted": this.state.mobileOptionsExpanded
    });
    return (
      <BlurOnLocationChange location={this.props.location}>
        <header className="reader-header">
          <Utility.SkipLink />
          <Layout.PreHeader />
          <nav className={innerClassName}>
            <div className="reader-header__menu-group reader-header__menu-group--left">
              <ReturnMenu.Button
                toggleReaderMenu={this.panelToggleHandler("readerReturn")}
                expanded={this.props.visibility.uiPanels.readerReturn}
              />
              {this.renderContentsButton(this.props.text.attributes)}
            </div>
            {this.props.section && (
              <TextTitles
                textTitle={this.props.text.attributes.titleFormatted}
                sectionTitle={this.props.section.attributes.name}
                showSection={!this.props.scrollAware.top}
              />
            )}
            <div className="reader-header__menu-group reader-header__menu-group--right">
              <ul
                aria-label="Reader Settings and Search"
                className="reader-header__nav-list"
              >
                <Authorize kind={"any"}>
                  <li className="reader-header__nav-item">
                    <ControlMenu.Button
                      onClick={this.panelToggleHandler("notes")}
                      icon="notes24"
                      label="Notes"
                      active={this.props.visibility.uiPanels.notes}
                    />
                  </li>
                </Authorize>
                <li className="reader-header__nav-item">
                  <ControlMenu.Button
                    onClick={this.panelToggleHandler("visibility")}
                    icon="eyeball24"
                    label="Visibility"
                    active={this.props.visibility.uiPanels.visibility}
                  />
                </li>
                <li className="reader-header__nav-item">
                  <ControlMenu.Button
                    onClick={this.panelToggleHandler("appearance")}
                    icon="text24"
                    label="Reader appearance"
                    active={this.props.visibility.uiPanels.appearance}
                  />
                </li>
                <li className="reader-header__nav-item">
                  <SearchMenu.Button
                    toggleSearchMenu={this.panelToggleHandler("search")}
                    active={this.props.visibility.uiPanels.search}
                    className="reader-header__button reader-header__button--pad-narrow"
                  />
                </li>
                <li className="reader-header__nav-item">
                  <UserMenuButton
                    authentication={this.props.authentication}
                    active={this.props.visibility.uiPanels.user}
                    showLoginOverlay={this.triggerShowSignInUpOverlay}
                    toggleUserMenu={this.panelToggleHandler("user")}
                    context="reader"
                    className="reader-header__button reader-header__button--pad-narrow"
                  />
                </li>
              </ul>
            </div>
          </nav>
          <div className="reader-header__panels reader-header__panels--left">
            <UIPanel
              id="readerReturn"
              visibility={this.props.visibility.uiPanels}
              bodyComponent={ReturnMenu.Body}
              returnUrl={lh.link(
                "frontendProjectDetail",
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

          <div className="reader-header__panels reader-header__panels--right">
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
                scope: "text"
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
              context="reader"
            />
          </div>
          {this.renderOptionsToggle()}
          <HeaderNotifications />
        </header>
      </BlurOnLocationChange>
    );
  }
}
