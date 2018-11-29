import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { List, Project } from "components/backend";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import debounce from "lodash/debounce";
import get from "lodash/get";

const { request } = entityStoreActions;

const perPage = 5;

export class DashboardsAuthorContainer extends PureComponent {
  static fetchData = (getState, dispatch) => {
    const projectsRequest = request(
      projectsAPI.index(
        { order: "sort_title ASC", withUpdateAbility: true },
        { size: perPage }
      ),
      requests.beProjects
    );
    return dispatch(projectsRequest);
  };

  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      recentProjects: select(requests.beRecentProjects, state.entityStore),
      currentUser: get(state, "authentication.currentUser")
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    currentUser: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: { order: "sort_title ASC", withUpdateAbility: true }
    };
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  updateResults(eventIgnored = null, page = 1) {
    const pagination = { number: page, size: perPage };
    const filter = this.state.filter;
    filter.withUpdateAbility = true;
    const action = request(
      projectsAPI.index(filter, pagination),
      requests.beProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  };

  updateHandlerCreator = page => {
    return event => {
      this.updateResults(event, page);
    };
  };

  render() {
    return (
      <div>
        <section>
          <div className="container">
            <section>
              <header className="section-heading-secondary">
                <h3>
                  {"Projects"}{" "}
                  <i className="manicon manicon-stack" aria-hidden="true" />
                </h3>
              </header>
              {this.props.projects && this.props.projectsMeta ? (
                <List.Searchable
                  entities={this.props.projects}
                  singularUnit="project"
                  pluralUnit="projects"
                  pagination={this.props.projectsMeta.pagination}
                  paginationClickHandler={this.updateHandlerCreator}
                  paginationClass="secondary"
                  entityComponent={Project.ListItem}
                  filterChangeHandler={this.filterChangeHandler}
                />
              ) : null}
            </section>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(DashboardsAuthorContainer);
