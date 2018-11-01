import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Project, ProjectDetail, Layout } from "components/frontend";
import { entityStoreActions } from "actions";
import { grab } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { Redirect } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import lh from "helpers/linkHandler";
import { HeadContent, LoadingBlock } from "components/global";
import HigherOrder from "containers/global/HigherOrder";

const { request, flush } = entityStoreActions;

export class ProjectDetailContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const projectRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      project: grab("projects", ownProps.match.params.id, state.entityStore),
      projectResponse: get(state.entityStore.responses, requests.feProject)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
  }

  get hasEvents() {
    const project = this.props.project;
    const events = project.relationships.events;
    return events && events.length > 0;
  }

  get hasTexts() {
    const project = this.props.project;
    const texts = project.relationships.texts;
    return texts && texts.length > 0;
  }

  get hasResources() {
    const project = this.props.project;
    const { collectionsCount, resourcesCount } = project.attributes;
    return collectionsCount > 0 || resourcesCount > 0;
  }

  get hasMetadata() {
    const project = this.props.project;
    const { metadata } = project.attributes;
    return metadata && !isEmpty(metadata);
  }

  render() {
    if (!this.props.projectResponse) return null;
    if (this.props.projectResponse.status === 401)
      return <Redirect to={lh.link("frontend")} />;
    const { project, settings } = this.props;
    if (!project) return <LoadingBlock />;

    return (
      <div className="project-detail">
        <HeadContent
          title={`\u201c${project.attributes.titlePlaintext}\u201d on ${
            settings.attributes.general.installationName
          }`}
          description={project.attributes.description}
          image={project.attributes.heroStyles.medium}
        />
        <Project.Hero project={project} />
        {this.hasEvents && (
          <ProjectDetail.Block title="Recent Activity" icon="pulse">
            <ProjectDetail.Activity project={project} />
          </ProjectDetail.Block>
        )}
        {this.hasTexts && (
          <ProjectDetail.Block title="Texts" icon="book-stack">
            <ProjectDetail.Texts project={project} />
          </ProjectDetail.Block>
        )}
        {this.hasResources && (
          <ProjectDetail.Block title="Resources" icon="cube-shine">
            <ProjectDetail.Resources project={project} />
          </ProjectDetail.Block>
        )}
        {this.hasMetadata && (
          <ProjectDetail.Block title="About" icon="tag">
            <ProjectDetail.Meta
              metadata={project.attributes.metadataFormatted}
            />
          </ProjectDetail.Block>
        )}
        <Layout.ButtonNavigation />
      </div>
    );
  }
}

export default connectAndFetch(
  HigherOrder.withSettings(ProjectDetailContainer)
);
