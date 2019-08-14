import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import ProjectCollection from "backend/components/project-collection";
import New from "./New";
import Drawer from "global/components/drawer";
import { childRoutes } from "helpers/router";
import size from "lodash/size";
import lh from "helpers/linkHandler";
import classnames from "classnames";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import IconComposer from "global/components/utility/IconComposer";

import Authorize from "hoc/authorize";

const { request, flush } = entityStoreActions;

export class ProjectCollectionWrapperContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      projectCollections: select(
        requests.beProjectCollections,
        state.entityStore
      )
    };
  };

  static fetchProjectCollections = dispatch => {
    const call = projectCollectionsAPI.index({ order: "position ASC" });

    return dispatch(request(call, requests.beProjectCollections));
  };

  static fetchData = (getState, dispatch) => {
    const promises = [];

    const call = projectCollectionsAPI.index({ order: "position ASC" });

    const { promise: one } = dispatch(
      request(call, requests.beProjectCollections)
    );
    promises.push(one);

    return Promise.all(promises);
  };

  static displayName = "ProjectCollection.Wrapper";

  static propTypes = {
    projectCollections: PropTypes.array,
    collectionProjects: PropTypes.array,
    refresh: PropTypes.func,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
    route: PropTypes.object
  };

  constructor() {
    super();
    this.state = { showNew: false };
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProjectCollections));
    this.props.dispatch(flush(requests.beProjects));
  }

  activeProjectCollection() {
    const { match, projectCollections } = this.props;
    if (!size(projectCollections) > 0) return null;
    return projectCollections.find(pc => pc.id === match.params.id);
  }

  updateProjectCollection = (projectCollection, changes, options = {}) => {
    const call = projectCollectionsAPI.update(projectCollection.id, changes);
    const projectCollectionRequest = request(
      call,
      requests.beProjectCollection,
      options
    );

    this.props.dispatch(projectCollectionRequest).promise.then(() => {
      ProjectCollectionWrapperContainer.fetchProjectCollections(
        this.props.dispatch
      );
    });
  };

  handleCollectionOrderChange = result => {
    const changes = { attributes: { position: result.position } };

    this.updateProjectCollection(result, changes, { noTouch: true });
  };

  handleCollectionSelect = collection => {
    const url = lh.link("backendProjectCollection", collection.id);
    this.props.history.push(url);
  };

  handleShowNew = event => {
    if (event) event.preventDefault();
    this.setState({ showNew: true });
  };

  handleHideNew = event => {
    if (event) event.preventDefault();
    this.setState({ showNew: false });
  };

  handleNewSuccess = projectCollection => {
    const path = lh.link("backendProjectCollection", projectCollection.id);
    this.props.history.push(path);
    this.handleHideNew();
  };

  handleToggleVisibility = (projectCollection, visible) => {
    const changes = { attributes: { visible } };
    this.updateProjectCollection(projectCollection, changes);
  };

  renderChildRoutes(active, projectCollections) {
    if (size(projectCollections) === 0)
      return (
        <ContentPlaceholder.Wrapper context="backend">
          <ContentPlaceholder.Title icon="booksOnShelfStrokeUnique">
            Ready to create a Project Collection?
          </ContentPlaceholder.Title>
          <ContentPlaceholder.Body>
            With Project Collections, you can take control of what appears on
            your Manifold Library homepage. Create custom groupings of Projects
            and change their order and visibility. You can handpick your
            collections and order them manually, or you can create Smart
            Collections that automatically update based on your filtering
            criteria.
          </ContentPlaceholder.Body>
          <ContentPlaceholder.Actions>
            <button
              className="button-icon-secondary"
              onClick={this.handleShowNew}
            >
              <IconComposer
                icon="plus16"
                size={20}
                iconClass={classnames(
                  "button-icon-secondary__icon",
                  "button-icon-secondary__icon--large"
                )}
              />
              <span>{"Create a Collection"}</span>
            </button>
          </ContentPlaceholder.Actions>
        </ContentPlaceholder.Wrapper>
      );
    const drawerProps = { closeUrl: lh.link("backendProjectCollections") };

    return childRoutes(this.props.route, {
      childProps: { projectCollection: active, drawerProps }
    });
  }

  render() {
    const projectCollection = this.activeProjectCollection();
    const projectCollections = this.props.projectCollections;
    if (!projectCollections) return null;

    const hasProjectCollections = projectCollections.length > 0;
    const wrapperClasses = classnames("project-collections", {
      "active-collection": projectCollection || this.state.showNew,
      empty: !hasProjectCollections
    });

    return (
      <Authorize
        ability="update"
        entity={["projectCollection"]}
        failureFatalError={{
          detail: "You are not allowed to manage project collections."
        }}
      >
        <section className={wrapperClasses}>
          <div className="backend-panel">
            <div className="container">
              {hasProjectCollections && (
                <ProjectCollection.List
                  projectCollection={projectCollection}
                  projectCollections={projectCollections}
                  onCollectionSelect={this.handleCollectionSelect}
                  onCollectionOrderChange={this.handleCollectionOrderChange}
                  onToggleVisibility={this.handleToggleVisibility}
                  onShowNew={this.handleShowNew}
                />
              )}
              <div className="panel">
                {hasProjectCollections && (
                  <ProjectCollection.Header
                    projectCollection={projectCollection}
                  />
                )}
                <Drawer.Wrapper
                  closeCallback={this.handleHideNew}
                  open={this.state.showNew}
                  style="backend flexible"
                  lockScroll="always"
                >
                  <New successHandler={this.handleNewSuccess} />
                </Drawer.Wrapper>
                {this.renderChildRoutes(projectCollection, projectCollections)}
              </div>
            </div>
          </div>
        </section>
      </Authorize>
    );
  }
}

export default connectAndFetch(ProjectCollectionWrapperContainer);
