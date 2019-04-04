import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import { matchPath } from "react-router";
import IconComposer from "global/components/utility/IconComposer";

import BlurOnLocationChange from "hoc/blur-on-location-change";
import Authorize from "hoc/authorize";

export class NavigationDropdown extends Component {
  static displayName = "Navigation.Dropdown";

  static propTypes = {
    links: PropTypes.array,
    classNames: PropTypes.string,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  get currentLabel() {
    const selected = this.visitLinks(this.props.links);
    if (!selected) return "";
    return selected.headerLabel || selected.label;
  }

  visitLinks(links) {
    const activeLink = links.find(link => {
      const route = lh.routeFromName(link.route);
      return matchPath(this.props.location.pathname, route) !== null;
    });
    if (activeLink && activeLink.children) {
      return this.visitLinks(activeLink.children);
    }
    return activeLink;
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  close = () => {
    this.setState({ open: false });
  };

  pathForLink(link) {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  }

  renderItem(link) {
    return (
      <li key={link.route} className="dropdown-nav__nav-item">
        <NavLink
          onClick={this.close}
          to={this.pathForLink(link)}
          className="dropdown-nav__link"
          activeClassName="dropdown-nav__link--active"
        >
          {link.label}
        </NavLink>
      </li>
    );
  }

  renderStatic(props) {
    const selected = this.getSelected(props);
    const label = selected ? selected.label : "menu";

    return (
      <nav className={`dropdown-nav dropdown-nav--static ${props.classNames}`}>
        <div className="dropdown-nav__selected">{label}</div>
      </nav>
    );
  }

  renderMenu(props) {
    const navClasses = classnames({
      "dropdown-nav": true,
      "dropdown-nav--open": this.state.open
    });

    return (
      <nav className={`${navClasses} ${this.props.classNames}`}>
        <button className="dropdown-nav__trigger" onClick={this.toggleOpen}>
          <div className="dropdown-nav__selected">
            {this.currentLabel}
            <IconComposer
              icon="disclosureDown16"
              size="default"
              iconClass="dropdown-nav__trigger-icon"
            />
          </div>
        </button>
        <ul className="dropdown-nav__nav-list">
          {props.links.map(link => {
            if (link.ability)
              return (
                <Authorize
                  key={`${link.route}-wrapped`}
                  entity={link.entity}
                  ability={link.ability}
                >
                  {this.renderItem(link)}
                </Authorize>
              );
            return this.renderItem(link);
          })}
        </ul>
      </nav>
    );
  }

  render() {
    return (
      <BlurOnLocationChange location={this.props.location}>
        {this.props.links.length > 1
          ? this.renderMenu(this.props)
          : this.renderStatic(this.props)}
      </BlurOnLocationChange>
    );
  }
}

export default withRouter(NavigationDropdown);
