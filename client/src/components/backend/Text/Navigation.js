import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class TextNavigation extends Component {

  static displayName = "Text.Navigation";

  static propTypes = {
    active: PropTypes.string,
    text: PropTypes.object
  };

  render() {
    const text = this.props.text;
    const active = this.props.active;

    return (
      <nav className="panel-nav">
        <ul>
          <li>
            <Link
              to={`/backend/text/${text.id}/`}
              className={active === 'general' ? 'active' : ''}
            >
              {'General'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/text/${text.id}/collaborators`}
              className={active === 'collaborators' ? 'active' : ''}
            >
              {'People'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/text/${text.id}/ingestion`}
              className={active === 'ingestion' ? 'active' : ''}
            >
              {'Ingestion'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/text/${text.id}/sections`}
              className={active === 'sections' ? 'active' : ''}
            >
              {'Sections'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/text/${text.id}/metadata`}
              className={active === 'metadata' ? 'active' : ''}
            >
              {'Metadata'}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

}
