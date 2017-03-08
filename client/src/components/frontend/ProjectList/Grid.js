import React, { Component, PropTypes } from 'react';
import { Project } from 'components/frontend';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import difference from 'lodash/difference';

export default class ProjectListGrid extends Component {

  static displayName = "ProjectList.Grid";

  static propTypes = {
    projects: PropTypes.array,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor() {
    super();
    this.enableAnimation = false;
  }

  componentWillReceiveProps(nextProps) {
    const currentIds = this.props.projects.map((p) => p.id);
    const nextIds = nextProps.projects.map((p) => p.id);
    const diffA = difference(currentIds, nextIds).length;
    const diffB = difference(nextIds, currentIds).length;
    if ((diffA + diffB) === 1) {
      this.enableAnimation = true;
    } else {
      this.enableAnimation = false;
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.projects !== this.props.projects) return true;
    if (nextProps.favorites !== this.props.favorites) return true;
    if (nextProps.authenticated !== this.props.authenticated) return true;
    return false;
  }

  render() {
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
          {this.props.projects.map((project) => {
            return (
              <li key={project.id} >
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
      </nav>
    );
  }
}
