import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList } from "components/frontend";
import get from "lodash/get";
import size from "lodash/size";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import { Utility } from "components/global";
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

  static defaultProps = {
    limit: 8
  };

  render() {
    const projectCollection = this.props.projectCollection;
    if (!projectCollection) return null;

    const backgroundClasses = classnames({
      "project-collection-summary": true,
      "bg-neutral05": this.props.ordinal % 2 === 0
    });
    const iconFill =
      projectCollection.attributes.icon === "new-round"
        ? "#52e3ac"
        : "currentColor";
    const description = projectCollection.attributes.description;
    const projects = projectCollection.relationships.collectionProjects.map(
      cp => cp.relationships.project
    );
    const hasProjects = size(projects) > 0;

    return (
      <section key={projectCollection.id} className={backgroundClasses}>
        <div className="container project-list-container">
          <Link
            className="section-heading"
            to={lh.link(
              "frontendProjectCollection",
              projectCollection.attributes.slug
            )}
          >
            <div className="main">
              <i className={"manicon"} aria-hidden="true">
                <Utility.IconComposer
                  icon={projectCollection.attributes.icon}
                  size={56}
                  fill={iconFill}
                />
              </i>
              <div className="body">
                <h4 className="title">{projectCollection.attributes.title}</h4>
              </div>
            </div>
          </Link>
          {description && (
            <div className="details">
              <p
                className="description"
                dangerouslySetInnerHTML={{
                  __html: projectCollection.attributes.description
                }}
              />
            </div>
          )}
          {hasProjects ? (
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={get(this.props.authentication, "currentUser.favorites")}
              projects={projects}
              dispatch={this.props.dispatch}
              limit={this.props.limit}
              viewAllUrl={lh.link(
                "frontendProjectCollection",
                this.props.projectCollection.attributes.slug
              )}
              viewAllLabel={"See the full collection"}
            />
          ) : (
            <div className="project-list empty">
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
