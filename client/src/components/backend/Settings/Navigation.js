import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class PanelNav extends Component {

  static displayName = "Project.Panel.Navigation";

  static propTypes = {
    active: PropTypes.string
  };

  render() {
    const active = this.props.active;

    return (
      <nav className="panel-nav">
        <ul>
          <li>
            <Link
              to={`/backend/settings`}
              className={active === 'general' ? 'active' : ''}
            >
              {'General'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/settings/theme`}
              className={active === 'theme' ? 'active' : ''}
            >
              {'Theme'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/settings/oauth`}
              className={active === 'oauth' ? 'active' : ''}
            >
              {'OAuth'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/settings/features`}
              className={active === 'features' ? 'active' : ''}
            >
              {'Features'}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

}
