import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import HigherOrder from 'containers/global/HigherOrder';
import lh from 'helpers/linkHandler';

export default class ReturnMenuBody extends PureComponent {

  static displayName = 'ReturnMenuBody';

  static propTypes = {
    projectId: PropTypes.string,
    projectTitle: PropTypes.string.isRequired,
    toggleSignInUpOverlay: PropTypes.func.isRequired,
    moreLink: PropTypes.string,
  };

  render() {
    return (
      <nav className="reader-return-menu">
        <ul>
          <li>
            <Link
              to={lh.link("frontendProject", this.props.projectId)}
            >
              <i className="manicon manicon-arrow-round-left"></i>
              {'Project Home'}
              <span>
                {this.props.projectTitle}
              </span>
            </Link>
          </li>
          <li>
            <Link
              to={lh.link("frontend")}
            >
              <i className="manicon manicon-books-with-glasses-simple"></i>{'Projects'}
            </Link>
          </li>
          <HigherOrder.RequireRole requiredRole="any">
            <li>
              <Link
                to={lh.link("frontendFollowing")}
              >
                <i className="manicon manicon-books-on-shelf-simple"></i>{'Following'}
              </Link>
            </li>
          </HigherOrder.RequireRole>
          <HigherOrder.RequireRole requiredRole="none">
            <li>
              <button onClick={this.props.toggleSignInUpOverlay}>
                <i className="manicon manicon-manifold-logo"></i>
                Sign-in
              </button>
              {this.props.moreLink ?
                <Link to={this.props.moreLink} target="_blank" className="note">
                  Learn More About <span>Manifold</span>
                </Link> : null
              }
            </li>
          </HigherOrder.RequireRole>
        </ul>
      </nav>
    );
  }
}
