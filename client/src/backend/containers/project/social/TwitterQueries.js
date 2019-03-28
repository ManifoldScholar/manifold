import React, { Component } from "react";
import PropTypes from "prop-types";
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

import Authorize from "hoc/authorize";

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
    dispatch: PropTypes.func
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
    const { twitterQueries, twitterQueriesMeta, project } = this.props;
    if (!twitterQueriesMeta || !twitterQueries) return null;

    const active = get(this.props.match, "params.qId");

    return (
      <Authorize entity={project} ability="manageTwitterQueries">
        <EntitiesList
          entityComponent={TwitterQueryRow}
          entities={twitterQueries}
          entityComponentProps={{ active }}
          title="Twitter Queries"
          titleStyle="section"
          instructions={`
            Manifold will periodically fetch tweets according to the queries specified
            below.
          `}
          buttons={[
            <Button
              path={lh.link("backendProjectSocialTwitterQueryNew", project.id)}
              text="Add a new twitter query"
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

export default connect(ProjectSocialTwitterQueriesContainer.mapStateToProps)(
  ProjectSocialTwitterQueriesContainer
);
