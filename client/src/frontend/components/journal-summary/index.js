import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import get from "lodash/get";
import memoize from "lodash/memoize";
import classnames from "classnames";
import lh from "helpers/linkHandler";
import Header from "../project-collection/Header";
import { CSSTransition } from "react-transition-group";
import JournalGridItem from "../project-list/JournalGridItem";

export default class JournalSummary extends Component {
  static displayName = "JournalSummary";

  static propTypes = {
    journalCollection: PropTypes.object.isRequired,
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
    return this.props.journalCollection;
  }

  get journals() {
    return this.mappedJournals(this.collection);
  }

  get journalsCount() {
    return this.collection.attributes.projectsCount;
  }

  get hasJournals() {
    return this.journals.length > 0;
  }

  mappedJournals = memoize(() => {
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
          <Header projectCollection={this.props.journalCollection} hasLink />
          {this.hasJournals ? (
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={get(
                this.props.authentication,
                "currentUser.favorites"
              )}
              projects={this.journals}
              dispatch={this.props.dispatch}
              limit={this.limit}
              showViewAll={this.journals.length < this.journalsCount}
              viewAllUrl={lh.link(
                "frontendJournals",
                this.collection.attributes.slug
              )}
              viewAllLabel={"See all journals"}
            >
              {this.journals.map(journal => {
                return (
                  <CSSTransition key={journal.id} timeout={250}>
                    <li className="project-list__item--pos-rel">
                      <JournalGridItem
                        authenticated={this.props.authentication.authenticated}
                        favorites={get(
                          this.props.authentication,
                          "currentUser.favorites"
                        )}
                        dispatch={this.props.dispatch}
                        journal={journal}
                      />
                    </li>
                  </CSSTransition>
                );
              })}
            </ProjectList.Grid>
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
