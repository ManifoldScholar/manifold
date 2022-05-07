import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { withTranslation } from "react-i18next";
import Resource from "frontend/components/resource";
import { entityStoreActions, fatalErrorActions } from "actions";
import { select } from "utils/entityUtils";
import { resourcesAPI, resourceCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/entity/HeadContent";
import some from "lodash/some";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";

const { request, flush } = entityStoreActions;

export class ResourceDetailContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    const resourceFetch = resourcesAPI.show(match.params.resourceId);
    const resourceAction = request(resourceFetch, requests.feResource);
    const { promise: one } = dispatch(resourceAction);
    const promises = [one];
    if (match.params.resourceCollectionId) {
      const collectionFetch = resourceCollectionsAPI.show(
        match.params.resourceCollectionId
      );
      const collectionAction = request(
        collectionFetch,
        requests.feResourceCollection
      );
      const { promise: two } = dispatch(collectionAction);
      promises.push(two);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      resourceCollection: select(
        requests.feResourceCollection,
        state.entityStore
      ),
      resource: select(requests.feResource, state.entityStore),
      visibility: state.ui.transitory.visibility
    };
  };

  static propTypes = {
    project: PropTypes.object,
    resourceCollection: PropTypes.object,
    resource: PropTypes.object,
    dispatch: PropTypes.func,
    visibility: PropTypes.object,
    journalBreadcrumbs: PropTypes.array
  };

  UNSAFE_componentWillMount() {
    if (this.props.resource && this.props.resourceCollection) {
      if (
        !this.collectionIncludesResource(
          this.props.resourceCollection,
          this.props.resource
        )
      ) {
        this.props.dispatch(fatalErrorActions.trigger404());
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feResource));
  }

  collectionIncludesResource(collection, resource) {
    return some(collection.relationships.resources, collectionResource => {
      return collectionResource.id === resource.id;
    });
  }

  collectionUrl() {
    return lh.link(
      "frontendProjectResourceCollection",
      this.props.project.attributes.slug,
      this.props.resourceCollection.attributes.slug
    );
  }

  projectUrl() {
    return lh.link(
      "frontendProjectResources",
      this.props.project.attributes.slug
    );
  }

  resourceUrl() {
    return lh.link(
      "frontendProjectResource",
      this.props.project.attributes.slug,
      this.props.resource.attributes.slug
    );
  }

  breadcrumbs() {
    const {
      journalBreadcrumbs,
      resourceCollection,
      project,
      resource,
      t,
      location
    } = this.props;
    const isCollectionMember = !!resourceCollection?.relationships?.resources?.find(
      r => r.id === resource.id
    );
    const collectionRoute =
      location.pathname.split("/").indexOf("resource-collection") >= 0;
    const projectCrumb = {
      to: lh.link("frontendProject", project.attributes.slug),
      label: project.attributes.titlePlaintext
    };
    const resourcesCrumb = collectionRoute
      ? {
          to: lh.link(
            "frontendProjectResourceCollections",
            project.attributes.slug
          ),
          label: t("glossary.resource_collection_other")
        }
      : {
          to: lh.link("frontendProjectResources", project.attributes.slug),
          label: t("glossary.resource_other")
        };
    const collectionCrumb =
      collectionRoute && isCollectionMember
        ? {
            to: this.collectionUrl(),
            label: resourceCollection.attributes.title
          }
        : null;
    const currentCrumb = {
      to: this.resourceUrl(),
      label: resource.attributes.titlePlaintext
    };
    return journalBreadcrumbs
      ? [
          ...journalBreadcrumbs,
          resourcesCrumb,
          collectionCrumb,
          currentCrumb
        ].filter(Boolean)
      : [projectCrumb, resourcesCrumb, collectionCrumb, currentCrumb].filter(
          Boolean
        );
  }

  render() {
    const { project, resource } = this.props;

    if (!project || !resource) {
      return <LoadingBlock />;
    }

    return (
      <>
        <EventTracker
          event={EVENTS.VIEW_RESOURCE}
          resource={this.props.resource}
        />
        <CheckFrontendMode debugLabel="ResourceDetail" isProjectSubpage />
        <EntityHeadContent entity={resource} parentEntity={project} />
        <RegisterBreadcrumbs breadcrumbs={this.breadcrumbs()} />
        {resource ? (
          <Resource.Detail
            projectId={project.id}
            projectUrl={this.projectUrl()}
            resourceUrl={this.resourceUrl()}
            resource={resource}
            dispatch={this.props.dispatch}
          />
        ) : (
          <LoadingBlock />
        )}
      </>
    );
  }
}

export default withTranslation()(connectAndFetch(ResourceDetailContainer));
