import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Resource, Utility } from "components/frontend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, resourcesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { HeadContent } from "components/global";

const { request, flush } = entityStoreActions;

export class ResourceDetailContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    const projectFetch = projectsAPI.show(match.params.id);
    const resourceFetch = resourcesAPI.show(match.params.resourceId);
    const projectAction = request(projectFetch, requests.feProject);
    const resourceAction = request(resourceFetch, requests.feResource);
    const { promise: one } = dispatch(projectAction);
    const { promise: two } = dispatch(resourceAction);
    return Promise.all([one, two]);
  };

  static mapStateToProps = state => {
    const props = {
      project: select(requests.feProject, state.entityStore),
      resource: select(requests.feResource, state.entityStore),
      visibility: state.ui.visibility
    };
    return props;
  };

  static propTypes = {
    project: PropTypes.object,
    resource: PropTypes.object,
    dispatch: PropTypes.func,
    visibility: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    this.props.dispatch(flush(requests.feResource));
  }

  projectUrl() {
    return lh.link(
      "frontendProjectResources",
      this.props.project.attributes.slug
    );
  }

  resourceUrl() {
    const pid = this.props.project.id;
    return lh.link("frontendProjectResource", pid);
  }

  render() {
    const projectId = this.props.project ? this.props.project.id : null;
    if (!projectId) return null;
    const { project, resource } = this.props;

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
        {this.props.project
          ? <Utility.BackLinkPrimary
              backText="Back to Project Resources"
              link={this.projectUrl()}
              title={this.props.project.attributes.title}
            />
          : null}
        {this.props.resource
          ? <Resource.Detail
              projectId={projectId}
              projectUrl={this.projectUrl()}
              resourceUrl={this.resourceUrl()}
              resource={this.props.resource}
              dispatch={this.props.dispatch}
            />
          : null}
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
