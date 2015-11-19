import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

export default class Header extends Component {

  static propTypes = {
    texts: PropTypes.object
  };

  render() {
    return (
      <header className={'header-browse'}>
        <Link to="{`/browse/`}" className="logo">
          <figure>
            <i className="manicon manicon-manifold-logo"></i>
            <span className="screen-reader-text">
              {'Manifold Logo: Click to return to the browse page'}
            </span>
          </figure>
        </Link>
        <nav className="text-nav">
          <ul>
            <li className="active">
              <Link to={`/browse/`}>
                Browse
              </Link>
            </li>
            <li>
              <Link to={`/browse/following/`}>
                Following
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="widget-nav">
          <button className="button-bare-icon button-magnify">
            <i className="manicon manicon-magnify"></i>
            <span className="screen-reader-text">{'Click to search Manifold library'}</span>
          </button>
          <button className="button-avatar">
            <i className="manicon manicon-person"></i>
            <span className="screen-reader-text">{'Click to open user settings'}</span>
          </button>
        </nav>
      </header>
    );
  }
}
