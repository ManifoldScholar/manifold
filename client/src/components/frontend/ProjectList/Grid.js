import React, { Component } from "react";
import PropTypes from "prop-types";
import { Project } from "components/frontend";
import { Utility } from "components/global";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import difference from "lodash/difference";

export default class ProjectListGrid extends Component {
  static displayName = "ProjectList.Grid";

  static propTypes = {
    projects: PropTypes.array,
    limit: PropTypes.number,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  constructor() {
    super();
    this.enableAnimation = false;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.projects !== this.props.projects) return true;
    if (nextProps.favorites !== this.props.favorites) return true;
    return nextProps.authenticated !== this.props.authenticated;
  }

  componentDidUpdate(prevProps) {
    const currentIds = this.props.projects.map(p => p.id);
    const prevIds = prevProps.projects.map(p => p.id);
    const diffA = difference(currentIds, prevIds).length;
    const diffB = difference(prevIds, currentIds).length;
    if (diffA + diffB === 1) {
      this.enableAnimation = true;
    } else {
      this.enableAnimation = false;
    }
  }

  projectsList() {
    if (!this.props.projects || this.props.projects.length === 0) return null;
    let out = null;
    if (this.props.limit) {
      out = this.props.projects.slice(0, this.props.limit);
    } else {
      out = this.props.projects;
    }
    return out;
  }

  render() {
    const projects = this.projectsList();
    if (!projects) return null;
    const hideDesc = true;

    return (
      <nav className="grid-project">
        <ReactCSSTransitionGroup
          transitionName="grid-project"
          transitionEnter={this.enableAnimation}
          transitionLeave={this.enableAnimation}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
          component="ul"
        >
          {projects.map(project => {
            return (
              <li key={project.id}>
                <Project.Thumbnail
                  authenticated={this.props.authenticated}
                  favorites={this.props.favorites}
                  dispatch={this.props.dispatch}
                  project={project}
                  hideDesc={hideDesc}
                />
              </li>
            );
          })}
        </ReactCSSTransitionGroup>
        {this.props.pagination ? (
          <Utility.Pagination
            paginationClickHandler={this.props.paginationClickHandler}
            pagination={this.props.pagination}
          />
        ) : null}
      </nav>
    );
  }
}
