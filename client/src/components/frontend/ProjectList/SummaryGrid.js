import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Project } from 'components/frontend';

export default class ProjectListSummaryGrid extends Component {

  static displayName = "ProjectList.SummaryGrid";

  static propTypes = {
    projects: PropTypes.array,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func
  };

  render() {
    const hideDate = true;
    return (
      <nav className="grid-project-summary">
        <ul>
          {this.props.projects.map((project) => {
            return (
              <li key={project.id} >
                <Project.Thumbnail
                  authenticated={this.props.authenticated}
                  favorites={this.props.favorites}
                  dispatch={this.props.dispatch}
                  project={project}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
