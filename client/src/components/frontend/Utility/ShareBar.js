import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ShareBar extends Component {

  static displayName = "Utility.ShareBar";

  static propTypes = {
    url: PropTypes.string
  };

  render() {
    return (
      <nav className="share-nav-primary">
        <span>Share</span>
        <ul>
          <li>
            <Link to="#">
              <i className="manicon manicon-twitter"></i>
            </Link>
          </li>
          <li>
            <Link to="#">
              <i className="manicon manicon-facebook"></i>
            </Link>
          </li>
          <li>
            <Link to="#">
              <i className="manicon manicon-envelope"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
