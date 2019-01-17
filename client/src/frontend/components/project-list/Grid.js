import React, { Component } from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import Utility from "global/components/utility";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import difference from "lodash/difference";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default class ProjectListGrid extends Component {
  static displayName = "ProjectList.Grid";

  static propTypes = {
    projects: PropTypes.array,
    limit: PropTypes.number,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    viewAllUrl: PropTypes.string,
    viewAllLabel: PropTypes.string,
    additionalClass: PropTypes.string
  };

  static defaultProps = {
    limit: null,
    viewAllLabel: "See All Projects"
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
    const prevProjects = prevProps.projects || [];
    const currentProjects = this.props.projects || [];
    const currentIds = currentProjects.map(p => p.id);
    const prevIds = prevProjects.map(p => p.id);
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
    switch (this.props.limit) {
      case null:
        return this.props.projects;
      case 0:
        return [];
      default:
        return this.props.projects.slice(0, this.props.limit);
    }
  }

  renderPagination(props) {
    const additionalClass = this.props.additionalClass;

    return (
      <div
        className={classNames({
          [`${additionalClass}__pagination`]: additionalClass
        })}
      >
        <Utility.Pagination
          paginationClickHandler={props.paginationClickHandler}
          pagination={props.pagination}
        />
      </div>
    );
  }

  renderViewAll(props) {
    if (!props.projects || props.projects.length === 0) return null;
    if (props.limit === null) return null;
    if (props.projects.length <= props.limit) return null;
    if (!props.viewAllUrl) return null;

    const additionalClass = this.props.additionalClass;

    return (
      <div
        className={classNames({
          [`${additionalClass}__utility`]: additionalClass,
          [`${additionalClass}__utility--footer`]: additionalClass
        })}
      >
        <Link to={this.props.viewAllUrl}>
          {this.props.viewAllLabel}
          <i className="manicon manicon-arrow-long-right" />
        </Link>
      </div>
    );
  }

  render() {
    const projects = this.projectsList();
    if (!projects) return null;
    const hideDesc = true;
    const additionalClass = this.props.additionalClass;

    return (
      <React.Fragment>
        <nav
          className={classNames("project-list grid", {
            [`${additionalClass}__body`]: additionalClass
          })}
        >
          <ReactCSSTransitionGroup
            transitionName="project-list grid"
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
        </nav>
        {this.props.pagination
          ? this.renderPagination(this.props)
          : this.renderViewAll(this.props)}
      </React.Fragment>
    );
  }
}
