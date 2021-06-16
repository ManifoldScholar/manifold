import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import memoize from "lodash/memoize";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import Header from "./Header";

export default class ProjectCollectionSummary extends Component {
  static displayName = "ProjectCollectionSummary";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    limit: PropTypes.number,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    ordinal: PropTypes.number,
    invertColor: PropTypes.bool
  };

  static defaultProps = {
    invertColor: false
  };

  get limit() {
    return this.props.limit;
  }

  get collection() {
    return this.props.projectCollection;
  }

  get projects() {
    return this.mappedProjects(this.collection);
  }

  get projectsCount() {
    return this.collection.attributes.projectsCount;
  }

  get hasProjects() {
    return this.projects.length > 0;
  }

  mappedProjects = memoize(() => {
    return this.collection.relationships.collectionProjects.map(
      cp => cp.relationships.project
    );
  });

  render() {
    if (!this.collection) return null;

    const backgroundClasses = classnames({
      "bg-neutral05":
        this.props.ordinal % 2 === (this.props.invertColor ? 1 : 0)
    });

    return (
      <section key={this.collection.id} className={backgroundClasses}>
        <div className="container">
          <Header projectCollection={this.props.projectCollection} hasLink />
          {this.hasProjects ? (
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              projects={this.projects}
              dispatch={this.props.dispatch}
              limit={this.limit}
              showViewAll={this.projects.length < this.projectsCount}
              viewAllUrl={lh.link(
                "frontendProjectCollection",
                this.collection.attributes.slug
              )}
              viewAllLabel={"See the full collection"}
            />
          ) : (
            <div className="entity-section-wrapper__body project-list empty">
              <p className="message">
                {"This Project Collection is currently empty."}
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }
}
