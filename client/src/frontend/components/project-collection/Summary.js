import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import IconComputed from "global/components/icon-computed";
import get from "lodash/get";
import memoize from "lodash/memoize";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";

export default class ProjectCollectionSummary extends Component {
  static displayName = "ProjectCollectionSummary";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    limit: PropTypes.number,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    ordinal: PropTypes.number
  };

  get limit() {
    return this.props.limit;
  }

  get collection() {
    return this.props.projectCollection;
  }

  get description() {
    return this.collection.attributes.descriptionFormatted;
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
      "project-collection-summary": true,
      "bg-neutral05": this.props.ordinal % 2 === 0
    });
    const iconFill =
      this.collection.attributes.icon === "new-round"
        ? "var(--accent-primary, #52e3ac)"
        : "currentColor";

    return (
      <section key={this.collection.id} className={backgroundClasses}>
        <div className="container entity-section-wrapper">
          <Link
            className="section-heading entity-section-wrapper__heading"
            to={lh.link(
              "frontendProjectCollection",
              this.collection.attributes.slug
            )}
          >
            <div className="main">
              <IconComputed.ProjectCollection
                icon={this.collection.attributes.icon}
                size={56}
                fill={iconFill}
              />
              <div className="body">
                <h2 className="title">{this.collection.attributes.title}</h2>
              </div>
            </div>
          </Link>
          {this.description && (
            <div className="entity-section-wrapper__details">
              <p
                className="description"
                dangerouslySetInnerHTML={{
                  __html: this.description
                }}
              />
            </div>
          )}
          {this.hasProjects ? (
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={get(
                this.props.authentication,
                "currentUser.favorites"
              )}
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
