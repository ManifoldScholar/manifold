import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { entityStoreActions } from "actions";
import { Log, List } from "components/backend";
import { Utility } from "components/global";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { connect } from "react-redux";

const perPage = 5;
const { request } = entityStoreActions;

export class LogContainer extends PureComponent {
  static displayName = "Project.Log";

  static mapStateToProps = state => {
    return {
      versions: select(requests.beVersions, state.entityStore),
      versionsMeta: meta(requests.beVersions, state.entityStore)
    };
  };

  static propTypes = {
    versions: PropTypes.array,
    versionsMeta: PropTypes.object,
    project: PropTypes.object.isRequired,
    dispatch: PropTypes.func
  };

  constructor() {
    super();
    this.lastFetchedPage = null;
    this.state = { filter: {} };
  }

  componentWillMount() {
    this.fetchVersions(1);
  }

  fetchVersions(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.versions(
        this.props.project.id,
        this.state.filter,
        pagination
      ),
      requests.beVersions
    );
    this.props.dispatch(action);
  }

  handleVersionsPageChange(event, page) {
    this.fetchVersions(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleVersionsPageChange(event, page);
    };
  };

  renderEmptyList = () => {
    return <div className="no-results">No log entries have been made yet.</div>;
  };

  render() {
    if (!this.props.versions) return null;

    return (
      <React.Fragment>
        <nav className="flush results-list">
          <List.SimpleList
            entities={this.props.versions}
            entityComponent={Log.ListItem}
            emptyListComponent={this.renderEmptyList}
            title="Project Changes"
            icon="manicon-pulse-small"
          />
        </nav>
        <Utility.Pagination
          pagination={this.props.versionsMeta.pagination}
          paginationPadding={3}
          paginationClickHandler={this.pageChangeHandlerCreator}
        />
      </React.Fragment>
    );
  }
}
export default connect(LogContainer.mapStateToProps)(LogContainer);
