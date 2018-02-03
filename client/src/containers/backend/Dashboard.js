import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { Dashboard as DashboardComponents } from "components/backend";
import HigherOrder from "containers/global/HigherOrder";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, statisticsAPI, requests } from "api";
import debounce from "lodash/debounce";

const { request } = entityStoreActions;

const perPage = 5;

export class DashboardContainer extends PureComponent {
  static fetchData = (getState, dispatch) => {
    const projectsRequest = request(
      projectsAPI.index({ order: "sort_title ASC" }, { size: perPage }),
      requests.beProjects
    );
    const recentProjectsRequest = request(
      projectsAPI.index({ order: "updated_at DESC" }, { size: 2 }),
      requests.beRecentProjects
    );
    const statsRequest = request(statisticsAPI.show(), requests.beStats);
    const { promise: one } = dispatch(projectsRequest);
    const { promise: two } = dispatch(recentProjectsRequest);
    const { promise: three } = dispatch(statsRequest);
    return Promise.all([one, two, three]);
  };

  static mapStateToProps = state => {
    return {
      statistics: select(requests.beStats, state.entityStore),
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      recentProjects: select(requests.beRecentProjects, state.entityStore)
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    recentProjects: PropTypes.array
  };

  constructor() {
    super();
    this.state = { filter: { order: "sort_title ASC" } };
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
    this.updateHandlerCreator = this.updateHandlerCreator.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  updateResults(event = null, page = 1) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.index(this.state.filter, pagination),
      requests.beProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  }

  updateHandlerCreator(page) {
    return event => {
      this.updateResults(event, page);
    };
  }

  render() {
    return (
      <div>
        <HigherOrder.RequireRole requiredRole="author">
          <DashboardComponents.Author
            filterChangeHandler={this.filterChangeHandler}
            updateHandlerCreator={this.updateHandlerCreator}
            {...this.props}
          />
        </HigherOrder.RequireRole>
        <HigherOrder.RequireRole requiredRole="admin">
          <DashboardComponents.Admin
            filterChangeHandler={this.filterChangeHandler}
            updateHandlerCreator={this.updateHandlerCreator}
            {...this.props}
          />
        </HigherOrder.RequireRole>
      </div>
    );
  }
}

export default connectAndFetch(DashboardContainer);
