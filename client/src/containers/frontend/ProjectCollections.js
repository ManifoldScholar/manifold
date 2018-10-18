import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectCollection, Utility } from "components/frontend";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { entityStoreActions } from "actions";
import { Utility as GlobalUtility } from "components/global";
import { select, meta } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import queryString from "query-string";

const { request } = entityStoreActions;
const perPage = 8;

export class ProjectsCollectionsContainer extends Component {
  static fetchData = (dispatch, location) => {
    const query = queryString.parse(location.search);
    const pagination = {
      number: query.page || 1,
      size: perPage
    };
    const collectionsRequest = request(
      projectCollectionsAPI.index(
        { withProjects: true, visible: true },
        pagination
      ),
      requests.feProjectCollections
    );
    return dispatch(collectionsRequest);
  };

  static mapStateToProps = state => {
    return {
      projectCollections: select(
        requests.feProjectCollections,
        state.entityStore
      ),
      projectCollectionsMeta: meta(
        requests.feProjectCollections,
        state.entityStore
      ),
      authentication: state.authentication
    };
  };

  static propTypes = {
    authentication: PropTypes.object,
    projectCollections: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    fetchData: PropTypes.func.isRequired,
    projectCollectionsMeta: PropTypes.object
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidMount() {
    ProjectsCollectionsContainer.fetchData(
      this.props.dispatch,
      this.props.location
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location === this.props.location) return null;
    ProjectsCollectionsContainer.fetchData(
      this.props.dispatch,
      this.props.location
    );
  }

  currentQuery() {
    return queryString.parse(this.props.location.search);
  }

  handlePageChange = (event, page) => {
    event.preventDefault();
    const query = Object.assign({}, this.currentQuery(), { page });
    this.doQuery(query);
  };

  doQuery(query) {
    const url = lh.link("frontendProjectCollections", query);
    this.props.history.push(url);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
    };
  };

  showPlaceholder() {
    const { location, projectCollections } = this.props;
    if (location.search) return false; // There are search filters applied, skip the check
    if (!projectCollections || projectCollections.length === 0) return true;
  }

  renderProjectCollections() {
    if (this.showPlaceholder()) return <ProjectCollection.Placeholder />;

    return this.props.projectCollections.map((projectCollection, index) => {
      return (
        <ProjectCollection.Summary
          key={projectCollection.id}
          authentication={this.props.authentication}
          projectCollection={projectCollection}
          dispatch={this.props.dispatch}
          limit={4}
          ordinal={index}
        />
      );
    });
  }

  render() {
    return (
      <div style={{ overflowX: "hidden" }}>
        <Utility.BackLinkPrimary
          link={lh.link("frontendProjects")}
          backText={"Back to projects"}
        />
        {this.renderProjectCollections()}
        {this.props.projectCollectionsMeta ? (
          <GlobalUtility.Pagination
            paginationClickHandler={this.pageChangeHandlerCreator}
            pagination={this.props.projectCollectionsMeta.pagination}
          />
        ) : null}
      </div>
    );
  }
}

export default connectAndFetch(ProjectsCollectionsContainer);
