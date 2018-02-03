import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Project, List } from "components/backend";
import lh from "helpers/linkHandler";

export default class BackendAuthorDashboard extends PureComponent {
  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object,
    projectsMeta: PropTypes.object,
    recentProjects: PropTypes.array,
    updateHandlerCreator: PropTypes.func,
    filterChangeHandler: PropTypes.func
  };

  render() {
    return (
      <div>
        <section>
          <div className="container">
            <section className="backend-dashboard">
              <div className="left">
                <header className="section-heading-secondary">
                  <h3>
                    {"Projects"} <i className="manicon manicon-stack" />
                  </h3>
                </header>
                {this.props.projects && this.props.projectsMeta
                  ? <List.Searchable
                      newButtonVisible
                      newButtonPath={lh.link("backendProjectsNew")}
                      newButtonText="Add a New Project"
                      entities={this.props.projects}
                      singularUnit="project"
                      pluralUnit="projects"
                      pagination={this.props.projectsMeta.pagination}
                      paginationClickHandler={this.props.updateHandlerCreator}
                      entityComponent={Project.ListItem}
                      filterChangeHandler={this.props.filterChangeHandler}
                    />
                  : null}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}
