import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { entityStoreActions } from "actions";
import { projectsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import { connect } from "react-redux";
import get from "lodash/get";
import EntitiesList, {
  Button,
  TwitterQueryRow
} from "backend/components/list/EntitiesList";

import Authorize from "hoc/Authorize";

const { request } = entityStoreActions;
const perPage = 10;

export class ProjectSocialTwitterQueriesContainer extends Component {
  static mapStateToProps = state => {
    return {
      twitterQueries: select(requests.beTwitterQueries, state.entityStore),
      twitterQueriesMeta: meta(requests.beTwitterQueries, state.entityStore)
    };
  };

  static displayName = "Project.Social.TwitterQueries";

  static propTypes = {
    project: PropTypes.object,
    twitterQueries: PropTypes.array,
    twitterQueriesMeta: PropTypes.object,
    match: PropTypes.object,
    dispatch: PropTypes.func,
    t: PropTypes.func
  };

  componentDidMount() {
    this.fetchTwitterQueries(1);
  }

  fetchTwitterQueries(page) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.twitterQueries(this.props.project.id, pagination),
      requests.beTwitterQueries
    );
    this.props.dispatch(action);
  }

  handlePageChange(event, page) {
    this.fetchTwitterQueries(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
    };
  };

  render() {
    const { twitterQueries, twitterQueriesMeta, project, t } = this.props;
    if (!twitterQueriesMeta || !twitterQueries) return null;

    const active = get(this.props.match, "params.qId");

    return (
      <Authorize entity={project} ability="manageTwitterQueries">
        <EntitiesList
          entityComponent={TwitterQueryRow}
          entities={twitterQueries}
          entityComponentProps={{ active }}
          title={t("projects.twitter_queries")}
          titleStyle="section"
          instructions={t("projects.twitter_queries_instructions")}
          buttons={[
            <Button
              path={lh.link("backendProjectSocialTwitterQueryNew", project.id)}
              text={t("projects.add_twitter_label")}
              type="add"
              authorizedFor={project}
              authorizedTo="createTwitterQueries"
            />
          ]}
        />
      </Authorize>
    );
  }
}

export default withTranslation()(
  connect(ProjectSocialTwitterQueriesContainer.mapStateToProps)(
    ProjectSocialTwitterQueriesContainer
  )
);
