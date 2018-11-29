import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ReturnMenuBody extends PureComponent {
  static displayName = "ReturnMenuBody";

  static propTypes = {
    returnUrl: PropTypes.string.isRequired,
    projectTitle: PropTypes.string.isRequired,
    toggleSignInUpOverlay: PropTypes.func.isRequired,
    moreLink: PropTypes.string
  };

  render() {
    return (
      <nav className="reader-return-menu">
        <ul>
          <li>
            <Link to={this.props.returnUrl}>
              <i
                className="manicon manicon-arrow-round-left"
                aria-hidden="true"
              />
              {"Project Home"}
              <span>{this.props.projectTitle}</span>
            </Link>
          </li>
          <li>
            <Link to={lh.link("frontend")}>
              <i
                className="manicon manicon-books-with-glasses-simple"
                aria-hidden="true"
              />
              {"Projects"}
            </Link>
          </li>
          <Authorize kind="any">
            <li>
              <Link to={lh.link("frontendFollowing")}>
                <i
                  className="manicon manicon-books-on-shelf-simple"
                  aria-hidden="true"
                />
                {"Following"}
              </Link>
            </li>
          </Authorize>
          <Authorize kind="unauthenticated">
            <li>
              <button
                onClick={this.props.toggleSignInUpOverlay}
                data-id="toggle-overlay"
                className="flush-bottom"
              >
                <i
                  className="manicon manicon-manifold-logo"
                  aria-hidden="true"
                />
                Sign-in
              </button>
              {this.props.moreLink ? (
                <a
                  href={this.props.moreLink}
                  target="_blank"
                  className="note"
                  rel="noopener noreferrer"
                >
                  Learn More About <span>Manifold</span>
                </a>
              ) : null}
            </li>
          </Authorize>
        </ul>
      </nav>
    );
  }
}