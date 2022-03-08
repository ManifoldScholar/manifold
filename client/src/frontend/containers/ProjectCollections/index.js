import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { entityStoreActions } from "actions";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import GlobalUtility from "global/components/utility";
import { select, meta } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import queryString from "query-string";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";

const { request } = entityStoreActions;
const perPage = 8;

export class ProjectsCollectionsContainer extends Component {
  static fetchData = (getState, dispatch, location) => {
    const query = queryString.parse(location.search);
    const pagination = {
      number: query.page || 1,
      size: perPage,
      collectionProjects: {
        number: 1,
        size: 4
      }
    };

    const collectionsFetch = projectCollectionsAPI.index(
      { visible: true, order: "position ASC" },
      pagination
    );
    const collectionsAction = request(
      collectionsFetch,
      requests.feProjectCollections
    );
    const { promise: one } = dispatch(collectionsAction);
    const promises = [one];
    return Promise.all(promises);
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
    projectCollectionsMeta: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location === this.props.location) return null;
    this.props.fetchData(this.props);
  }

  get projectCollections() {
    return this.props.projectCollections;
  }

  get projectCollectionsMeta() {
    return this.props.projectCollectionsMeta;
  }

  get location() {
    return this.props.location;
  }

  get showPlaceholder() {
    if (this.location.search) return false; // There are search filters applied, skip the check
    if (!this.projectCollections?.length) return true;
  }

  get showPagination() {
    if (
      isEmpty(this.projectCollectionsMeta) ||
      !this.projectCollectionsMeta.pagination
    )
      return false;
    if (this.projectCollectionsMeta.pagination.totalPages === 1) return false;
    return true;
  }

  currentQuery() {
    return queryString.parse(this.props.location.search);
  }

  handlePageChange = (event, page) => {
    event.preventDefault();
    const query = { ...this.currentQuery(), page };
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

  renderProjectCollections() {
    if (this.showPlaceholder)
      return <EntityCollectionPlaceholder.ProjectCollectionsFrontend />;

    return this.projectCollections.map((projectCollection, index) => (
      <EntityCollection.ProjectCollectionSummary
        key={projectCollection.id}
        projectCollection={projectCollection}
        limit={4}
        bgColor={index % 2 === 1 ? "neutral05" : "white"}
      />
    ));
  }

  render() {
    const t = this.props.t;
    return (
      <>
        <CheckFrontendMode debugLabel="ProjectCollections" isProjectSubpage />
        <h1 className="screen-reader-text">
          {t("glossary.project_collection_other")}
        </h1>
        {this.renderProjectCollections()}
        {this.showPagination && (
          <section>
            <div className="container">
              <GlobalUtility.Pagination
                paginationClickHandler={this.pageChangeHandlerCreator}
                pagination={this.projectCollectionsMeta.pagination}
              />
            </div>
          </section>
        )}
        <CollectionNavigation />
      </>
    );
  }
}

export default withTranslation()(connectAndFetch(ProjectsCollectionsContainer));
