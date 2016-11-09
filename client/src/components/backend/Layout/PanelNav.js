import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class PanelNav extends Component {

  static displayName = "Layout.PanelNav";

  static propTypes = {
  };

  render() {
    return (
      <nav className="panel-nav">
        <ul>
          <li>
            <Link to="/backend/project/2/">
              {'General'}
            </Link>
          </li>
          <li>
            <Link to="/backend/project/2/texts">
              {'Texts'}
            </Link>
          </li>
          <li>
            <Link to="#" className="active">
              {'Resources'}
            </Link>
          </li>
          <li>
            <Link to="#">
              {'Metadata'}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

}
