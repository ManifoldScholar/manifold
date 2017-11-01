import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Resource, Utility } from "components/frontend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, resourcesAPI, collectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { HeadContent, LoadingBlock } from "components/global";
import some from "lodash/some";

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
    const props = {
      collection: select(requests.feCollection, state.entityStore),
      project: select(requests.feProject, state.entityStore),
      resource: select(requests.feResource, state.entityStore),
      visibility: state.ui.transitory.visibility
    };
    return props;
  };

  static propTypes = {
    project: PropTypes.object,
    collection: PropTypes.object,
    resource: PropTypes.object,
    dispatch: PropTypes.func,
    visibility: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.resource && nextProps.collection) {
      if (
        !this.collectionIncludesResource(
          nextProps.resource,
          nextProps.collection
        )
      ) {
        // TODO: Render the NotFound component.
        // Let's upgrade to React 16 for error boundaries first.
        // throw new Error("Page not found");
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
      "frontendProjectCollection",
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
    const { project, resource } = this.props;
    if (!project || !resource) {
      return <LoadingBlock />;
    }

    return (
      <div>
        <HeadContent
          title={`Manifold Scholarship | ${project.attributes
            .title} | ${resource.attributes.titlePlaintext}`}
          description={resource.attributes.captionPlaintext}
          image={
            resource.attributes.attachmentStyles.mediumSquare ||
            resource.attributes.variantThumbnailStyles.mediumSquare
          }
        />
        {this.props.collection
          ? <Utility.BackLinkPrimary
              backText="Back to Collection"
              link={this.collectionUrl()}
              title={this.props.collection.attributes.title}
            />
          : <Utility.BackLinkPrimary
              backText="Back to Project Resources"
              link={this.projectUrl()}
              title={this.props.project.attributes.title}
            />}
        {this.props.resource
          ? <Resource.Detail
              projectId={project.id}
              projectUrl={this.projectUrl()}
              resourceUrl={this.resourceUrl()}
              resource={this.props.resource}
              dispatch={this.props.dispatch}
            />
          : <LoadingBlock />}
        {this.props.project
          ? <section className="bg-neutral05">
              <Utility.BackLinkSecondary
                backText="Back to Project Resources"
                link={this.projectUrl()}
              />
            </section>
          : null}
      </div>
    );
  }
}

export default connectAndFetch(ResourceDetailContainer);
