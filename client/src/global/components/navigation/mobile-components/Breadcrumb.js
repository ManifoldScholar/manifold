import React, { PureComponent } from "react";
import { matchPath } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export default class MobileBreadcrumb extends PureComponent {
  static propTypes = {
    links: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired
  };

  get segments() {
    const segments = [];
    const first = this.match(this.props.links);
    if (first) {
      segments.push(first);
      const second = this.match(first.children);
      if (second) {
        segments.push(second);
      }
    }
    return segments;
  }

  match(links) {
    if (!links) return null;
    return links.find(link => {
      const route = lh.routeFromName(link.route);

      if (link.matchType === "link" || link.externalUrl) {
        return this.props.location.pathname === this.pathForLink(link);
      }
      return matchPath(this.props.location.pathname, route) !== null;
    });
  }

  pathForLink(link) {
    if (link.externalUrl) return link.externalUrl;
    const args = link.args || [];
    const route = link.linksTo || link.route;
    return lh.link(route, ...args);
  }

  render() {
    let count = 0;
    const segments = this.segments;
    const size = segments.length;

    return (
      <nav className="breadcrumb-list hide-75">
        {this.segments.map(link => {
          count += 1;
          return (
            <span key={count}>
              <NavLink
                className="breadcrumb-list__link"
                to={this.pathForLink(link)}
              >
                {link.label}
              </NavLink>
              {count < size && (
                <IconComposer
                  icon="disclosureDown16"
                  size="default"
                  iconClass="breadcrumb-list__icon"
                />
              )}
            </span>
          );
        })}
      </nav>
    );
  }
}
