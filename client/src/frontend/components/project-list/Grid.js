import React, { Component } from "react";
import PropTypes from "prop-types";
import GridItem from "./GridItem";
import Utility from "global/components/utility";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
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
    viewAllLabel: PropTypes.string
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

  shouldShowViewAll(props) {
    if (props.showViewAll) return true;
    if (!props.projects || props.projects.length === 0) return false;
    if (props.limit === null) return false;
    if (props.projects.length <= props.limit) return false;
    if (!props.viewAllUrl) return false;
    return true;
  }

  renderViewAll(props) {
    if (!this.shouldShowViewAll(props)) return null;

    return (
      <div
        className={classNames(
          "entity-section-wrapper__utility",
          "entity-section-wrapper__utility--footer"
        )}
      >
        <Link to={this.props.viewAllUrl}>
          {this.props.viewAllLabel}
          <Utility.IconComposer icon="arrowLongRight16" size="default" />
        </Link>
      </div>
    );
  }

  renderPagination(props) {
    return (
      <div className="entity-section-wrapper__pagination">
        <Utility.Pagination
          paginationClickHandler={props.paginationClickHandler}
          pagination={props.pagination}
        />
      </div>
    );
  }

  render() {
    const projects = this.projectsList();
    if (!projects) return null;
    const hideDesc = true;

    return (
      <>
        <div className="project-list grid entity-section-wrapper__body">
          <ReactTransitionGroup className="project-list grid" component="ul">
            {projects.map(project => {
              return (
                <CSSTransition
                  key={project.id}
                  enter={this.enableAnimation}
                  exit={this.enableAnimation}
                  timeout={{ enter: 250, exit: 250 }}
                >
                  <li className="project-list__item--pos-rel">
                    <GridItem
                      authenticated={this.props.authenticated}
                      favorites={this.props.favorites}
                      dispatch={this.props.dispatch}
                      project={project}
                      hideDesc={hideDesc}
                    />
                  </li>
                </CSSTransition>
              );
            })}
          </ReactTransitionGroup>
        </div>
        {this.props.pagination
          ? this.renderPagination(this.props)
          : this.renderViewAll(this.props)}
      </>
    );
  }
}
