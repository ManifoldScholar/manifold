import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import { matchPath } from "react-router";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import memoize from "lodash/memoize";
import UserLinks from "./mobile-components/UserLinks";
import MobileSearch from "./mobile-components/Search";
import MobileBreadcrumb from "./mobile-components/Breadcrumb";
import FocusTrap from "focus-trap-react";

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

  get initialState() {
    return {
      expanded: [],
      open: false
    };
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
    const active = [];
    this.props.links.forEach(link => {
      const route = lh.routeFromName(link.route);
      const match = matchPath(this.props.location.pathname, route) !== null;
      if (match) active.push(link.route);
    });
    return active;
  }

  renderExternalLink(link) {
    return (
      <a
        href={link.externalUrl}
        target={link.newTab ? "_blank" : null}
        rel="noopener noreferrer"
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
      nested: hasChildren,
      open: expanded
    });

    return (
      <li key={`${link.label}-${index}`} className={wrapperClasses}>
        {hasChildren ? (
          <i
            role="button"
            onClick={this.createExpandToggleHandler(link.route)}
            className={`manicon manicon-caret-up`}
          />
        ) : null}
        {link.route
          ? this.renderManifoldLink(link)
          : this.renderExternalLink(link)}
        {hasChildren ? (
          <ul>{children.map(child => this.renderItem(child))}</ul>
        ) : null}
      </li>
    );
  }

  render() {
    const navClasses = classnames({
      "nested-nav": true,
      "hide-75": true,
      open: this.state.open
    });
    const triggerClass = this.state.open ? "x" : "bars-parallel-horizontal";

    return (
      <nav className={navClasses}>
        <MobileBreadcrumb
          links={this.props.links}
          location={this.props.location}
        />
        {this.state.open ? (
          <BodyClass className={"no-scroll"}>
            <FocusTrap
              focusTrapOptions={{
                clickOutsideDeactivates: true
              }}
            >
              <div className="nested-nav-content">
                <ul className="primary-links">
                  {this.props.links.map((link, index) => {
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
                  {this.props.mode === "frontend" ? (
                    <li>
                      <MobileSearch />
                    </li>
                  ) : null}
                </ul>
                <UserLinks
                  {...this.props}
                  closeNavigation={this.closeNavigation}
                />
              </div>
            </FocusTrap>
          </BodyClass>
        ) : null}
        <i
          role="button"
          className={`manicon manicon-${triggerClass}`}
          onClick={this.toggleOpen}
        />
      </nav>
    );
  }
}

export default withRouter(NavigationMobile);
