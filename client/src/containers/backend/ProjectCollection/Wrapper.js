import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { ProjectCollection } from "components/backend";
import { ProjectCollection as ProjectCollectionContainer } from "containers/backend";
import { Drawer } from "components/global";
import { HigherOrder } from "containers/global";
import { childRoutes } from "helpers/router";
import size from "lodash/size";
import lh from "helpers/linkHandler";
import classnames from "classnames";

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
        <ProjectCollection.Placeholder
          createClickHandler={this.handleShowNew}
        />
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
      "active-collection": projectCollection || this.state.showNew
    });

    return (
      <HigherOrder.Authorize
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
                  <ProjectCollectionContainer.New
                    successHandler={this.handleNewSuccess}
                  />
                </Drawer.Wrapper>
                {this.renderChildRoutes(projectCollection, projectCollections)}
              </div>
            </div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connectAndFetch(ProjectCollectionWrapperContainer);
