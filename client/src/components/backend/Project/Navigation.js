import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class PanelNav extends Component {

  static displayName = "Project.Panel.Navigation";

  static propTypes = {
    active: PropTypes.string,
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const active = this.props.active;

    return (
      <nav className="panel-nav">
        <ul>
          <li>
            <Link
              to={`/backend/project/${project.id}/`}
              className={active === 'general' ? 'active' : ''}
            >
              {'General'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/project/${project.id}/collaborators`}
              className={active === 'collaborators' ? 'active' : ''}
            >
              {'People'}
            </Link>
          </li>
          <li>
            <Link
              to={`/backend/project/${project.id}/texts`}
              className={active === 'texts' ? 'active' : ''}
            >
              {'Texts'}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

}
