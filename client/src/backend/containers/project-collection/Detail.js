import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import ProjectCollection from "backend/components/project-collection";
import Utility from "global/components/utility";
import { entityStoreActions } from "actions";
import { meta } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import { childRoutes } from "helpers/router";
import Manual from "./Detail/Manual";
import Smart from "./Detail/Smart";
import lh from "helpers/linkHandler";
import get from "lodash/get";

import Authorize from "hoc/authorize";

const { request, flush } = entityStoreActions;
const perPage = 12;

export class ProjectCollectionDetail extends PureComponent {
  static mapStateToProps = state => {
    return {
      projectCollectionMeta: meta(
        requests.beProjectCollection,
        state.entityStore
      )
    };
  };

  static displayName = "ProjectCollection.Detail";

  static propTypes = {
    projectCollection: PropTypes.object,
    projectCollectionMeta: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  componentDidMount() {
    this.fetchProjectCollection();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const prevMatch = prevProps.match;
    if (!prevProps.projectCollection) return this.fetchProjectCollection();

    if (prevMatch.params.id !== match.params.id) {
      return this.fetchProjectCollection();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProjectCollection));
    this.props.dispatch(flush(requests.beCollectionProjectReorder));
    this.props.dispatch(flush(requests.beProjectCollectionUpdate));
  }

  fetchProjectCollection(page = 1) {
    const { projectCollection } = this.props;
    if (!projectCollection) return null;

    const pageParams = { number: page };
    if (!projectCollection.attributes.manuallySorted) pageParams.size = perPage;
    const pagination = { collectionProjects: pageParams };

    const call = projectCollectionsAPI.show(projectCollection.id, pagination);
    this.props.dispatch(request(call, requests.beProjectCollection));
  }

  handleProjectOrderChange = result => {
    const changes = { attributes: { position: result.position } };
    const call = projectCollectionsAPI.updateCollectionProject(
      this.props.projectCollection.id,
      result.id,
      changes
    );
    const projectCollectionRequest = request(
      call,
      requests.beCollectionProjectReorder,
      { noTouch: true }
    );

    this.props.dispatch(projectCollectionRequest).promise.then(() => {
      this.fetchProjectCollection();
    });
  };

  handleSortOrderChange = sortOrder => {
    const { projectCollection } = this.props;
    const pageParams = projectCollection.attributes.manuallySorted
      ? { number: 1 }
      : { number: 1, size: perPage };
    const pagination = { collectionProjects: pageParams };

    const call = projectCollectionsAPI.update(
      this.props.projectCollection.id,
      { attributes: { sortOrder } },
      pagination
    );
    const projectCollectionRequest = request(
      call,
      requests.beProjectCollectionUpdate
    );

    this.props.dispatch(projectCollectionRequest).promise.then(() => {
      this.fetchProjectCollection();
    });
  };

  drawerProps(props) {
    return {
      lockScroll: "always",
      style: "backend flexible",
      closeUrl: lh.link("backendProjectCollection", props.projectCollection.id)
    };
  }

  handlePageChange(event, page) {
    this.fetchProjectCollection(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
    };
  };

  renderPagination(projectCollection, projectCollectionMeta) {
    if (projectCollection.attributes.manuallySorted) return null;
    const collectionProjectsPagination = get(
      projectCollectionMeta,
      "relationships.collectionProjects.pagination"
    );

    return (
      <Utility.Pagination
        paginationClickHandler={this.pageChangeHandlerCreator}
        pagination={collectionProjectsPagination}
        level={"secondary"}
      />
    );
  }

  render() {
    const { projectCollection, projectCollectionMeta } = this.props;
    if (!projectCollection || !projectCollectionMeta) return null;

    const projects = projectCollection.relationships.collectionProjects.map(
      cp => cp.relationships.project
    );

    return (
      <Authorize
        entity={projectCollection}
        failureFatalError={{
          detail: "You are not allowed to edit this project collection."
        }}
        ability="update"
      >
        <div>
          <ProjectCollection.SortBy
            sortChangeHandler={this.handleSortOrderChange}
            projectCollection={this.props.projectCollection}
          />
          {projectCollection.attributes.smart ? (
            <Smart projects={projects} {...this.props} />
          ) : (
            <Manual
              projects={projects}
              orderChangeHandler={this.handleProjectOrderChange}
              {...this.props}
            />
          )}
          {this.renderPagination(projectCollection, projectCollectionMeta)}
          {childRoutes(this.props.route, {
            childProps: { projectCollection, projectCollectionMeta },
            drawer: true,
            drawerProps: this.drawerProps(this.props)
          })}
        </div>
      </Authorize>
    );
  }
}

export default connectAndFetch(ProjectCollectionDetail);