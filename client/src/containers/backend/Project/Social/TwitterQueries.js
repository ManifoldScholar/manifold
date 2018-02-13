import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, TwitterQuery, Form } from "components/backend";
import { entityStoreActions } from "actions";
import { projectsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import { Link } from "react-router-dom";
import { Utility } from "components/global";
import lh from "helpers/linkHandler";
import { connect } from "react-redux";
import get from "lodash/get";

const { request } = entityStoreActions;
const perPage = 10;

export class ProjectSocialTwitterQueriesContainer extends Component {
  static displayName = "Project.Social.TwitterQueries";

  static mapStateToProps = state => {
    return {
      twitterQueries: select(requests.beTwitterQueries, state.entityStore),
      twitterQueriesMeta: meta(requests.beTwitterQueries, state.entityStore)
    };
  };

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
    this.lastFetchedPage = page;
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
    const { twitterQueries, twitterQueriesMeta } = this.props;
    if (!twitterQueriesMeta || !twitterQueries) return null;

    const active = get(this.props.match, "params.qId");
    const instructions = (
      <p className="instructional-copy">
        Manifold will periodically fetch tweets according to the queries
        specified below.
      </p>
    );

    return (
      <Form.FieldGroup label="Twitter Queries" instructions={instructions}>
        <nav className="vertical-list-primary flush">
          <div className="buttons-icon-horizontal">
            <Link
              to={lh.link(
                "backendProjectSocialTwitterQueryNew",
                this.props.project.id
              )}
              className="button-icon-secondary"
            >
              <i className="manicon manicon-plus" />
              Add a New Twitter Query
            </Link>
          </div>
          {twitterQueries
            ? <List.SimpleList
                entities={twitterQueries}
                entityComponent={TwitterQuery.ListItem}
                entityComponentProps={{ active }}
              />
            : null}
        </nav>
        <Utility.Pagination
          pagination={twitterQueriesMeta.pagination}
          paginationClickHandler={this.pageChangeHandlerCreator}
        />
      </Form.FieldGroup>
    );
  }
}

export default connect(ProjectSocialTwitterQueriesContainer.mapStateToProps)(
  ProjectSocialTwitterQueriesContainer
);
