import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Utility from "frontend/components/utility";
import Resource from "frontend/components/resource";
import { entityStoreActions, fatalErrorActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, resourcesAPI, collectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";
import HeadContent from "global/components/head-content";
import some from "lodash/some";

import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;

export class ResourceDetailContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    const projectFetch = projectsAPI.show(match.params.id);
    const resourceFetch = resourcesAPI.show(match.params.resourceId);
    const projectAction = request(projectFetch, requests.feProject);
    const resourceAction = request(resourceFetch, requests.feResource);
    const { promise: one } = dispatch(projectAction);
    const { promise: two } = dispatch(resourceAction);
    const promises = [one, two];
    if (match.params.collectionId) {
      const collectionFetch = collectionsAPI.show(match.params.collectionId);
      const collectionAction = request(collectionFetch, requests.feCollection);
      const { promise: three } = dispatch(collectionAction);
      promises.push(three);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      collection: select(requests.feCollection, state.entityStore),
      project: select(requests.feProject, state.entityStore),
      resource: select(requests.feResource, state.entityStore),
      visibility: state.ui.transitory.visibility
    };
  };

  static propTypes = {
    project: PropTypes.object,
    collection: PropTypes.object,
    settings: PropTypes.object.isRequired,
    resource: PropTypes.object,
    dispatch: PropTypes.func,
    visibility: PropTypes.object
  };

  componentWillMount() {
    if (this.props.resource && this.props.collection) {
      if (
        !this.collectionIncludesResource(
          this.props.collection,
          this.props.resource
        )
      ) {
        this.props.dispatch(fatalErrorActions.trigger404());
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    this.props.dispatch(flush(requests.feResource));
  }

  collectionIncludesResource(collection, resource) {
    return some(collection.relationships.resources, collectionResource => {
      return collectionResource.id === resource.id;
    });
  }

  collectionUrl() {
    return lh.link(
      "frontendResourceCollection",
      this.props.project.attributes.slug,
      this.props.collection.attributes.slug
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

  render() {
    const { project, resource, settings, collection } = this.props;
    if (!project || !resource) {
      return <LoadingBlock />;
    }

    return (
      <div>
        <HeadContent
          title={`\u201c${
            resource.attributes.titlePlaintext
          }\u201d Resource on ${settings.attributes.general.installationName}`}
          description={resource.attributes.captionPlaintext}
          image={
            resource.attributes.attachmentStyles.mediumSquare ||
            resource.attributes.variantThumbnailStyles.mediumSquare
          }
        />
        {collection ? (
          <Utility.BackLinkPrimary
            backText="Back to Collection"
            link={this.collectionUrl()}
            title={collection.attributes.title}
          />
        ) : (
          <Utility.BackLinkPrimary
            backText="Back to Project Resources"
            link={this.projectUrl()}
            title={project.attributes.titlePlaintext}
          />
        )}
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
        {project ? (
          <section className="bg-neutral05">
            <Utility.BackLinkSecondary
              backText="Back to Project Resources"
              link={this.projectUrl()}
            />
          </section>
        ) : null}
      </div>
    );
  }
}

export default connectAndFetch(
  withSettings(ResourceDetailContainer)
);