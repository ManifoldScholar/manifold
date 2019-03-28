import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import EntitiesList, { LogRow } from "backend/components/list/EntitiesList";

import Authorize from "hoc/authorize";

const perPage = 5;
const { request } = entityStoreActions;

export class LogContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      versions: select(requests.beVersions, state.entityStore),
      versionsMeta: meta(requests.beVersions, state.entityStore)
    };
  };

  static displayName = "Project.Log";

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

  componentDidMount() {
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

  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="readLog"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        {this.props.versions && (
          <EntitiesList
            title="Project Changes"
            titleIcon="BEActivity64"
            entities={this.props.versions}
            entityComponent={LogRow}
            pagination={this.props.versionsMeta.pagination}
            showCount
            unit={"change"}
            callbacks={{
              onPageClick: this.pageChangeHandlerCreator
            }}
          />
        )}
      </Authorize>
    );
  }
}
export default connect(LogContainer.mapStateToProps)(LogContainer);
