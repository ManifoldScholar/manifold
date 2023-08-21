import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { collectionProjectsAPI, projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import ProjectCollection from "backend/components/project-collection";
import New from "./New";
import Drawer from "global/components/drawer";
import { childRoutes } from "helpers/router";
import size from "lodash/size";
import lh from "helpers/linkHandler";
import classnames from "classnames";
import HeadContent from "global/components/HeadContent";
import withConfirmation from "hoc/withConfirmation";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { fluidScale } from "theme/styles/mixins";

import Authorize from "hoc/Authorize";

const { request, flush } = entityStoreActions;

export class ProjectCollectionWrapperContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      projectCollections: select(
        requests.beProjectCollections,
        state.entityStore
      ),
      projectCollection: select(
        requests.beProjectCollection,
        state.entityStore
      ),
      collectionProjects: select(
        requests.beCollectionProjects,
        state.entityStore
      )
    };
  };

  static displayName = "ProjectCollection.Wrapper";

  static propTypes = {
    projectCollections: PropTypes.array,
    collectionProjects: PropTypes.array,
    refresh: PropTypes.func,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
    route: PropTypes.object,
    confirm: PropTypes.func,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { showNew: false, newFormDirty: false };
  }

  componentDidMount() {
    this.fetchProjectCollections();
    this.fetchProjectCollection();
    this.fetchCollectionProjects();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProjectCollection));
    this.props.dispatch(flush(requests.beProjectCollections));
    this.props.dispatch(flush(requests.beProjects));
    this.props.dispatch(flush(requests.beCollectionProjects));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchProjectCollection();
      this.fetchCollectionProjects();
    }
  }

  fetchProjectCollections = () => {
    const call = projectCollectionsAPI.index(
      { order: "position ASC" },
      { number: 1, size: 100 }
    );
    const { promise } = this.props.dispatch(
      request(call, requests.beProjectCollections)
    );
    return promise;
  };

  fetchProjectCollection = (page = 1, perPage = 12) => {
    const id = this.props.match.params.id;
    if (!id) return Promise.resolve();

    const pageParams = { number: page, size: perPage };
    const pagination = { collectionProjects: pageParams };

    const call = projectCollectionsAPI.show(id, pagination);
    const { promise } = this.props.dispatch(
      request(call, requests.beProjectCollection)
    );
    return promise;
  };

  fetchCollectionProjects = () => {
    const id = this.props.match.params.id;
    if (!id) return Promise.resolve();
    const call = collectionProjectsAPI.index(id);
    const { promise } = this.props.dispatch(
      request(call, requests.beCollectionProjects)
    );
    return promise;
  };

  destroyProjectCollection = (afterDestroy = this.returnToList) => {
    const projectCollection = this.props.projectCollection;
    const call = projectCollectionsAPI.destroy(projectCollection.id);
    const options = { removes: projectCollection };
    const destroyRequest = request(
      call,
      requests.beProjectCollectionDestroy,
      options
    );
    const { promise } = this.props.dispatch(destroyRequest);
    promise.then(afterDestroy);
    return promise;
  };

  returnToList = () => {
    return this.props.history.push(lh.link("backendProjectCollections"));
  };

  buildUpdateProjectCollection = (id, changes) => {
    return projectCollectionsAPI.update(id, changes);
  };

  buildCreateProjectCollection = model => {
    return projectCollectionsAPI.create(model);
  };

  updateCollectionProject = (id, changes, options = {}) => {
    const projectCollection = this.props.projectCollection;
    const call = projectCollectionsAPI.updateCollectionProject(
      projectCollection.id,
      id,
      changes
    );
    const projectCollectionRequest = request(
      call,
      requests.beCollectionProjectUpdate,
      options
    );
    const { promise } = this.props.dispatch(projectCollectionRequest);
    return promise;
  };

  updateProjectCollection = (
    changes,
    options = {},
    optionalProjectCollection = null
  ) => {
    const projectCollection =
      optionalProjectCollection || this.props.projectCollection;
    const config = this.buildUpdateProjectCollection(
      projectCollection.id,
      changes
    );
    const updateRequest = request(
      config,
      requests.beProjectCollectionUpdate,
      options
    );
    const { promise } = this.props.dispatch(updateRequest);
    promise.then(this.fetchCollectionProjects);
    return promise;
  };

  handleCollectionOrderChange = result => {
    const changes = { attributes: { position: result.position } };
    this.updateProjectCollection(
      changes,
      { noTouch: true },
      { id: result.id }
    ).then(this.fetchProjectCollections);
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
    if (this.state.newFormDirty) {
      const heading = this.props.t("messages.confirm");
      const message = this.props.t("messages.unsaved_changes");
      return this.props.confirm(heading, message, () =>
        this.setState({ showNew: false })
      );
    }
    this.setState({ showNew: false });
  };

  handleNewSuccess = projectCollection => {
    this.fetchProjectCollections();
    const path = lh.link("backendProjectCollection", projectCollection.id);
    this.props.history.push(path);
    this.handleHideNew();
  };

  handleToggleVisibility = (projectCollection, visible) => {
    const changes = { attributes: { visible } };
    this.updateProjectCollection(changes, {}, projectCollection);
  };

  get childProps() {
    return {
      projectCollection: this.props.projectCollection,
      projectCollections: this.props.projectCollections,
      collectionProjects: this.props.collectionProjects,
      destroyProjectCollection: this.destroyProjectCollection,
      updateProjectCollection: this.updateProjectCollection,
      updateCollectionProject: this.updateCollectionProject,
      buildUpdateProjectCollection: this.buildUpdateProjectCollection,
      buildCreateProjectCollection: this.buildCreateProjectCollection,
      refreshProjectCollection: this.fetchProjectCollection,
      refreshProjectCollections: this.fetchProjectCollections,
      refreshCollectionProjects: this.fetchCollectionProjects,
      drawerProps: {
        closeUrl: lh.link("backendProjectCollections")
      }
    };
  }

  renderChildRoutes() {
    return childRoutes(this.props.route, {
      childProps: this.childProps
    });
  }

  get hasProjectCollections() {
    return !this.noProjectCollections;
  }

  get noProjectCollections() {
    return size(this.props.projectCollections) === 0;
  }

  render() {
    const t = this.props.t;
    const projectCollection = this.props.projectCollection;
    const projectCollections = this.props.projectCollections;
    if (!projectCollections) return null;

    const wrapperClasses = classnames("project-collections", {
      "active-collection": this.props.match.params.id || this.state.showNew,
      empty: this.noProjectCollections
    });

    const collectionForHeader = this.props.match.params.id
      ? projectCollection
      : null;
    const pageTitle = collectionForHeader
      ? collectionForHeader.attributes.title
      : t("titles.project_collections");

    const breadcrumbs = collectionForHeader
      ? [
          { to: null, label: t("glossary.project_title_case_other") },
          {
            to: lh.link("backendProjectCollections"),
            label: t("glossary.project_collection_title_case_other")
          },
          {
            to: lh.link("backendProjectCollections", projectCollection.id),
            label: projectCollection.attributes.title
          }
        ]
      : [
          { to: null, label: t("glossary.project_title_case_other") },
          {
            to: lh.link("backendProjectCollections"),
            label: t("glossary.project_collection_title_case_other")
          }
        ];

    return (
      <Authorize
        ability="update"
        entity={["projectCollection"]}
        failureFatalError={{
          detail: this.props.t("project_collections.unauthorized")
        }}
      >
        <HeadContent
          title={`${pageTitle} | ${t("common.admin")}`}
          appendDefaultTitle
        />
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
        <section className={wrapperClasses}>
          <div className="backend-panel">
            <div
              className="container"
              style={{ marginBlockStart: fluidScale("30px", "20px") }}
            >
              {this.hasProjectCollections && (
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
                {this.hasProjectCollections && (
                  <ProjectCollection.Header
                    projectCollection={collectionForHeader}
                  />
                )}
                <Drawer.Wrapper
                  closeCallback={this.handleHideNew}
                  open={this.state.showNew}
                  context="backend"
                  size="flexible"
                  padding="large"
                  lockScroll="always"
                >
                  <New
                    successHandler={this.handleNewSuccess}
                    setDirty={val => this.setState({ newFormDirty: val })}
                    {...this.childProps}
                  />
                </Drawer.Wrapper>
                {this.noProjectCollections ? (
                  <EntityCollectionPlaceholder.ProjectCollectionsBackend
                    onClick={this.handleShowNew}
                  />
                ) : (
                  this.renderChildRoutes()
                )}
              </div>
            </div>
          </div>
        </section>
      </Authorize>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ProjectCollectionWrapperContainer))
);
