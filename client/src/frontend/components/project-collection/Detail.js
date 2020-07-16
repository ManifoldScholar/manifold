import React, { Component } from "react";
import PropTypes from "prop-types";
import Filters from "./Filters";
import ProjectList from "frontend/components/project-list";
import Utility from "global/components/utility";
import get from "lodash/get";
import DetailHeader from "./DetailHeader";

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

  render() {
    const projectCollection = this.props.projectCollection;
    if (!projectCollection) return null;

    return (
      <section key={projectCollection.id} className="bg-neutral05">
        <div className="container entity-section-wrapper">
          <div>
            <DetailHeader {...projectCollection.attributes} />
          </div>
          <Filters
            filterChangeHandler={this.props.filterChangeHandler}
            initialState={this.props.initialState}
          />
          <div className="entity-section-wrapper__details">
            {this.description && (
              <p
                className="description"
                dangerouslySetInnerHTML={{
                  __html: this.description
                }}
              />
            )}
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
