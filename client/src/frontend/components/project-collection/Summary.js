import React, { Component } from "react";
import PropTypes from "prop-types";
import GridList from "../atomic/grid-list";
import get from "lodash/get";
import memoize from "lodash/memoize";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import Header from "./Header";
import { CSSTransition } from "react-transition-group";
import ProjectGridItem from "../grid-list-items/ProjectGridItem";

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
            <GridList
              authenticated={this.props.authentication.authenticated}
              favorites={get(
                this.props.authentication,
                "currentUser.favorites"
              )}
              dispatch={this.props.dispatch}
              limit={this.limit}
              showViewAll={this.projects.length < this.projectsCount}
              viewAllUrl={lh.link(
                "frontendProjectCollection",
                this.collection.attributes.slug
              )}
              viewAllLabel={"See the full collection"}
            >
              {this.projects.map(project => {
                return (
                  <CSSTransition
                    key={project.id}
                    enter
                    exit
                    timeout={{ enter: 250, exit: 250 }}
                  >
                    <li className="grid-list__item--pos-rel">
                      <ProjectGridItem
                        authenticated={this.props.authentication.authenticated}
                        favorites={get(
                          this.props.authentication,
                          "currentUser.favorites"
                        )}
                        dispatch={this.props.dispatch}
                        project={project}
                      />
                    </li>
                  </CSSTransition>
                );
              })}
            </GridList>
          ) : (
            <div className="entity-section-wrapper__body grid-list empty">
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
