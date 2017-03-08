import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import HigherOrder from 'containers/global/HigherOrder';

export default class ReturnMenuBody extends Component {

  static propTypes = {
    projectId: PropTypes.string,
    projectTitle: PropTypes.string,
    toggleSignInUpOverlay: PropTypes.func,
    moreLink: PropTypes.string,
  };

  render() {
    return (
      <nav className="reader-return-menu">
        <ul>
          <li>
            <Link to={`/browse/project/${this.props.projectId}`}>
              <i className="manicon manicon-arrow-round-left"></i>
              {'Project Home'}
              <span>
                  {/*
                   Note that this should be the project title, which isn't
                   available to this component yet. Testing with this as it should
                   be similar.
                   */}
                {this.props.projectTitle}
              </span>
            </Link>
          </li>
          <li>
            <Link to="/browse/">
              <i className="manicon manicon-books-with-glasses-simple"></i>{'Projects'}
            </Link>
          </li>
          <HigherOrder.RequireRole requiredRole="any">
            <li>
              <Link to="/browse/following/">
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
              <Link to={this.props.moreLink} target="_blank" className="note">
                Learn More About <span>Manifold</span>
              </Link>
            </li>
          </HigherOrder.RequireRole>
        </ul>
      </nav>
    );
  }
}
