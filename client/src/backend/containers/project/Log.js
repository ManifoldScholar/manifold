import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import EntitiesList, { LogRow } from "backend/components/list/EntitiesList";

import Authorize from "hoc/Authorize";

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
    dispatch: PropTypes.func,
    t: PropTypes.func
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
    const { project, t, versionsMeta } = this.props;

    return (
      <Authorize
        entity={project}
        ability="readLog"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        {this.props.versions && (
          <EntitiesList
            title={t("projects.changes")}
            titleStyle="bar"
            titleTag="h2"
            titleIcon="BEActivity64"
            entities={this.props.versions}
            entityComponent={LogRow}
            pagination={versionsMeta.pagination}
            showCount
            unit={t("glossary.change", {
              count: versionsMeta?.pagination?.totalCount
            })}
            callbacks={{
              onPageClick: this.pageChangeHandlerCreator
            }}
          />
        )}
      </Authorize>
    );
  }
}
export default withTranslation()(
  connect(LogContainer.mapStateToProps)(LogContainer)
);
