import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import HigherOrder from "containers/global/HigherOrder";
import lh from "helpers/linkHandler";

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
              <i className="manicon manicon-arrow-round-left" />
              {"Project Home"}
              <span>
                {this.props.projectTitle}
              </span>
            </Link>
          </li>
          <li>
            <Link to={lh.link("frontend")}>
              <i className="manicon manicon-books-with-glasses-simple" />
              {"Projects"}
            </Link>
          </li>
          <HigherOrder.RequireRole requiredRole="any">
            <li>
              <Link to={lh.link("frontendFollowing")}>
                <i className="manicon manicon-books-on-shelf-simple" />
                {"Following"}
              </Link>
            </li>
          </HigherOrder.RequireRole>
          <HigherOrder.RequireRole requiredRole="none">
            <li>
              <button
                onClick={this.props.toggleSignInUpOverlay}
                data-id="toggle-overlay"
              >
                <i className="manicon manicon-manifold-logo" />
                Sign-in
              </button>
              {this.props.moreLink
                ? <a
                    href={this.props.moreLink}
                    target="_blank"
                    className="note"
                  >
                    Learn More About <span>Manifold</span>
                  </a>
                : null}
            </li>
          </HigherOrder.RequireRole>
        </ul>
      </nav>
    );
  }
}
