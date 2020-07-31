import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import Utility from "global/components/utility";
import get from "lodash/get";
import Header from "./Header";
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

  get collectionAttributes() {
    return this.props.projectCollection.attributes;
  }

  render() {
    const projectCollection = this.props.projectCollection;
    if (!projectCollection) return null;

    return (
      <section key={projectCollection.id} className="bg-neutral05">
        <div className="container">
          <Header projectCollection={projectCollection} />
          <div className="project-collection-header__filter">
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
            favorites={get(this.props.authentication, "currentUser.favorites")}
            projects={this.props.projects}
            dispatch={this.props.dispatch}
            paginationClickHandler={this.props.paginationClickHandler}
            pagination={this.props.pagination}
          />
        </div>
      </section>
    );
  }
}
