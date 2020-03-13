import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter, matchPath } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import memoize from "lodash/memoize";
import UserLinks from "./mobile-components/UserLinks";
import MobileSearch from "./mobile-components/Search";
import MobileBreadcrumb from "./mobile-components/Breadcrumb";
import FocusTrap from "focus-trap-react";
import IconComposer from "global/components/utility/IconComposer";
import { FrontendModeContext } from "helpers/contexts";

import Authorize from "hoc/authorize";
import BodyClass from "hoc/body-class";

export class NavigationMobile extends Component {
  static displayName = "Navigation.Mobile";

  static propTypes = {
    links: PropTypes.array,
    location: PropTypes.object,
    authentication: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
    style: PropTypes.object
  };

  static contextType = FrontendModeContext;

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  /*
  There is some recursion involved in figuring out the active route, so let's be a little
  conservative around when we update.
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.links !== this.props.links) return true;
    if (nextProps.authentication !== this.props.authentication) return true;
    if (nextProps.location !== this.props.location) return true;
    if (nextProps.mode !== this.props.mode) return true;
    return nextState !== this.state;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.open) return null;
    if (prevProps.location.pathname === this.props.location.pathname)
      return null;
    this.setState(this.initialState);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  get initialState() {
    return {
      expanded: [],
      open: false
    };
  }

  get triggerIcon() {
    return this.state.open ? "close32" : "menu32";
  }

  get hasLinks() {
    return this.props.links && this.props.links.length > 0;
  }

  get isStandalone() {
    return this.context.isStandalone;
  }

  pathForLink(link) {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  }

  createExpandToggleHandler = memoize(key => {
    return event => {
      event.preventDefault();
      this.toggleExpanded(key);
    };
  });

  toggleOpen = () => {
    if (this.state.open) {
      this.closeNavigation();
    } else {
      this.openNavigation();
    }
  };

  toggleExpanded = key => {
    if (this.state.expanded.includes(key)) {
      this.collapse(key);
    } else {
      this.expand(key);
    }
  };

  handleEscape = event => {
    if (event.keyCode !== 27) return;
    this.closeNavigation();
  };

  expand(key) {
    if (this.state.expanded.includes(key)) return;
    const expanded = this.state.expanded.slice(0);
    expanded.push(key);
    this.setState({ expanded });
  }

  collapse(key) {
    if (!this.state.expanded.includes(key)) return;
    const expanded = this.state.expanded.slice(0);
    expanded.splice(expanded.indexOf(key), 1);
    this.setState({ expanded });
  }

  closeNavigation = () => {
    this.setState({ open: false, expanded: [] });
    window.removeEventListener("keyup", this.handleEscape);
  };

  openNavigation = () => {
    this.setState({ open: true, expanded: this.activeRoutes() });
    window.addEventListener("keyup", this.handleEscape);
  };

  activeRoutes() {
    if (!this.props.links) return null;
    const active = [];
    this.props.links.forEach(link => {
      const route = lh.routeFromName(link.route);
      const match = matchPath(this.props.location.pathname, route) !== null;
      if (match) active.push(link.route);
    });
    return active;
  }

  renderStandaloneHeading() {
    if (!this.isStandalone || !this.context.project) return null;

    const { titleFormatted, subtitleFormatted } = this.context.project;

    return (
      <li className="nested-nav__item">
        <div className="nested-nav__standalone-heading">
          {titleFormatted && (
            <div
              className="nested-nav__standalone-title"
              dangerouslySetInnerHTML={{ __html: titleFormatted }}
            />
          )}
          {subtitleFormatted && (
            <div
              className="nested-nav__standalone-subtitle"
              dangerouslySetInnerHTML={{ __html: subtitleFormatted }}
            />
          )}
        </div>
      </li>
    );
  }

  renderExternalLink(link) {
    return (
      <a
        href={link.externalUrl}
        target={link.newTab ? "_blank" : null}
        rel="noopener noreferrer"
        className="nested-nav__link"
      >
        {link.label}
      </a>
    );
  }

  renderManifoldLink(link) {
    const path = this.pathForLink(link);
    const exact = path === "/";

    return (
      <NavLink
        to={path}
        exact={exact}
        onClick={this.closeNavigation}
        target={link.newTab ? "_blank" : null}
        className="nested-nav__link"
        activeClassName="active"
      >
        {link.label}
      </NavLink>
    );
  }

  renderItem(link, index) {
    if (link.hideInNav) return null;
    const children = link.children || [];
    const hasChildren = children && children.length > 0;
    const expanded = this.state.expanded.includes(link.route);
    const wrapperClasses = classnames({
      "nested-nav__item": true,
      "nested-nav__grid-item": true,
      "nested-nav__item--nested": hasChildren,
      "nested-nav__item--open": expanded
    });

    return (
      <li key={`${link.label}-${index}`} className={wrapperClasses}>
        {link.route
          ? this.renderManifoldLink(link)
          : this.renderExternalLink(link)}
        {hasChildren && (
          <button
            onClick={this.createExpandToggleHandler(link.route)}
            className="nested-nav__disclosure-button"
            aria-haspopup="true"
            aria-expanded={expanded}
          >
            <span className="screen-reader-text">
              {`${expanded ? "Close" : "Open"} submenu`}
            </span>
            <IconComposer
              icon="disclosureDown16"
              size="default"
              iconClass="nested-nav__disclosure-icon"
            />
          </button>
        )}
        {hasChildren && (
          <ul className="nested-nav__list nested-nav__list--nested">
            {children.map(child => this.renderItem(child))}
          </ul>
        )}
      </li>
    );
  }

  renderNavigationMenu() {
    return (
      <BodyClass className={"no-scroll"}>
        <FocusTrap
          focusTrapOptions={{
            clickOutsideDeactivates: true
          }}
        >
          <div className="nested-nav__content">
            <ul
              aria-label="Page Links"
              className="nested-nav__list nested-nav__list--primary-links"
            >
              {this.isStandalone && this.renderStandaloneHeading()}
              {this.hasLinks &&
                this.props.links.map((link, index) => {
                  if (link.ability)
                    return (
                      <Authorize
                        key={`${link.route}-wrapped`}
                        entity={link.entity}
                        ability={link.ability}
                      >
                        {this.renderItem(link, index)}
                      </Authorize>
                    );
                  return this.renderItem(link, index);
                })}
              {this.props.mode === "frontend" && (
                <li className="nested-nav__item">
                  <MobileSearch closeNavigation={this.closeNavigation} />
                </li>
              )}
            </ul>
            <UserLinks {...this.props} closeNavigation={this.closeNavigation} />
          </div>
        </FocusTrap>
      </BodyClass>
    );
  }

  render() {
    const navClasses = classnames({
      "hide-75": true,
      "nested-nav": true,
      "nested-nav--open": this.state.open,
      "nested-nav--dark": this.props.mode === "backend"
    });

    return (
      <>
        {this.hasLinks && (
          <MobileBreadcrumb
            links={this.props.links}
            location={this.props.location}
          />
        )}
        <nav className={navClasses} aria-label="Mobile Navigation">
          {this.state.open && this.renderNavigationMenu()}
        </nav>
        <button
          onClick={this.toggleOpen}
          className="mobile-nav-toggle"
          aria-haspopup
          aria-expanded={this.state.open}
        >
          <span className="screen-reader-text">
            {`${this.state.open ? "Close" : "Open"} mobile navigation menu`}
          </span>
          <IconComposer
            icon={this.triggerIcon}
            size="default"
            iconClass="mobile-nav-trigger__icon"
          />
        </button>
      </>
    );
  }
}

export default withRouter(NavigationMobile);
