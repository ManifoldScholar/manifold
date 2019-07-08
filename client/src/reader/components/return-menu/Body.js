import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

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
      <nav className="reader-return-menu" aria-label="Site Navigation">
        <ul className="reader-return-menu__list">
          <li className="reader-return-menu__item">
            <Link
              to={this.props.returnUrl}
              className="reader-return-menu__link"
            >
              <IconComposer
                icon="circleArrowLeft64"
                size={36.923}
                iconClass="reader-return-menu__link-icon"
              />
              <span className="reader-return-menu__link-text">
                {"Project Home"}
              </span>
              <span className="reader-return-menu__small-text">
                {this.props.projectTitle}
              </span>
            </Link>
          </li>
          <li className="reader-return-menu__item">
            <Link to={lh.link("frontend")} className="reader-return-menu__link">
              <IconComposer
                icon="projects64"
                size={36.923}
                iconClass="reader-return-menu__link-icon"
              />
              <span className="reader-return-menu__link-text">
                {"Projects"}
              </span>
            </Link>
          </li>
          <Authorize kind="any">
            <li className="reader-return-menu__item">
              <Link
                to={lh.link("frontendFollowing")}
                className="reader-return-menu__link"
              >
                <IconComposer
                  icon="following64"
                  size={36.923}
                  iconClass="reader-return-menu__link-icon"
                />
                <span className="reader-return-menu__link-text">
                  {"Following"}
                </span>
              </Link>
            </li>
          </Authorize>
          <Authorize kind="unauthenticated">
            <li className="reader-return-menu__item">
              <button
                onClick={this.props.toggleSignInUpOverlay}
                data-id="toggle-overlay"
                className="reader-return-menu__link reader-return-menu__link--flush-bottom"
              >
                <IconComposer
                  icon="manifoldLogo32"
                  size={28}
                  iconClass="reader-return-menu__logo-icon"
                />
                <span className="reader-return-menu__link-text">Sign-in</span>
              </button>
              {this.props.moreLink ? (
                <a
                  href={this.props.moreLink}
                  target="_blank"
                  className="reader-return-menu__note"
                  rel="noopener noreferrer"
                >
                  Learn More About{" "}
                  <span className="reader-return-menu__note-bold">
                    Manifold
                  </span>
                </a>
              ) : null}
            </li>
          </Authorize>
        </ul>
      </nav>
    );
  }
}
