import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import Utility from "global/components/utility";
import get from "lodash/get";
import classnames from "classnames";
import Header from "./Header";
import Constants from "./Constants";
import Filters from "./Filters";

export default class ProjectCollectionDetail extends Component {
  static displayName = "ProjectCollectionDetail";

  static propTypes = {
    projectCollection: PropTypes.object,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    projects: PropTypes.array,
    filterChangeHandler: PropTypes.func,
    initialState: PropTypes.object
  };

  get description() {
    return this.props.projectCollection.attributes.descriptionFormatted;
  }

  get isFull() {
    return !!(
      this.props.projectCollection.attributes.heroStyles &&
      this.props.projectCollection.attributes.heroLayout === Constants.FULL
    );
  }

  render() {
    const projectCollection = this.props.projectCollection;
    if (!projectCollection) return null;

    return (
      <section key={projectCollection.id} className="bg-neutral05">
        <div className="container">
          <div className="section-heading entity-section-wrapper__heading">
            <Header projectCollection={projectCollection} />
          </div>
          <div className={classnames({ container: this.isFull })}>
            <div className="project-collection_filter">
              <Filters
                filterChangeHandler={this.props.filterChangeHandler}
                initialState={this.props.initialState}
              />
            </div>
            <div className="entity-section-wrapper__details">
              <Utility.EntityCount
                pagination={this.props.pagination}
                singularUnit="project"
                pluralUnit="projects"
                countOnly
              />
            </div>
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={get(
                this.props.authentication,
                "currentUser.favorites"
              )}
              projects={this.props.projects}
              dispatch={this.props.dispatch}
              paginationClickHandler={this.props.paginationClickHandler}
              pagination={this.props.pagination}
            />
          </div>
        </div>
      </section>
    );
  }
}
