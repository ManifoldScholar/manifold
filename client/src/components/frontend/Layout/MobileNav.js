import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class MobileNav extends Component {
  static displayName = "Layout.MobileNav";

  static propTypes = {
    location: PropTypes.object
  };

  getActiveLink(props) {
    const path = props.location.pathname;
    let out = null;
    switch (path) {
      case lh.link("frontend"):
        out = "browse";
        break;
      case lh.link("frontendFollowing"):
        out = "following";
        break;
      default:
        break;
    }
    return out;
  }

  render() {
    const active = this.getActiveLink(this.props);

    return (
      <nav className="footer-fixed">
        <ul className="text-nav">
          <li>
            <Link
              to={lh.link("frontend")}
              className={active === "browse" ? "active" : ""}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              to={lh.link("frontendFollowing")}
              className={active === "following" ? "active" : ""}
            >
              Following
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
