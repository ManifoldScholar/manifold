import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList } from "components/frontend";
import get from "lodash/get";
import memoize from "lodash/memoize";
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

  get collection() {
    return this.props.projectCollection;
  }

  get description() {
    return this.collection.attributes.descriptionFormatted;
  }

  get projects() {
    return this.mappedProjects(this.collection);
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
        ? "#52e3ac"
        : "currentColor";

    return (
      <section key={this.collection.id} className={backgroundClasses}>
        <div className="container project-list-container">
          <Link
            className="section-heading"
            to={lh.link(
              "frontendProjectCollection",
              this.collection.attributes.slug
            )}
          >
            <div className="main">
              <i className={"manicon"} aria-hidden="true">
                <Utility.IconComposer
                  icon={this.collection.attributes.icon}
                  size={56}
                  fill={iconFill}
                />
              </i>
              <div className="body">
                <h4 className="title">{this.collection.attributes.title}</h4>
              </div>
            </div>
          </Link>
          {this.description && (
            <div className="details">
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
              limit={this.props.limit}
              viewAllUrl={lh.link(
                "frontendProjectCollection",
                this.collection.attributes.slug
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
