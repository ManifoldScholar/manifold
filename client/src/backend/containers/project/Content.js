import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ContentBlock from "backend/components/content-block";
import Hero from "backend/components/project/hero";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import Authorize from "hoc/authorize";
import { select } from "utils/entityUtils";
import get from "lodash/get";

const { request } = entityStoreActions;

export class ProjectContentContainer extends PureComponent {
  static displayName = "Project.ContentContainer";

  static fetchActionCallouts(projectId, dispatch) {
    const call = projectsAPI.actionCallouts(projectId);
    const actionCalloutsRequest = request(
      call,
      requests.beProjectActionCallouts
    );
    const { promise } = dispatch(actionCalloutsRequest);
    return promise;
  }

  static fetchContentBlocks(projectId, dispatch) {
    const call = projectsAPI.contentBlocks(projectId);
    const contentBlocksRequest = request(call, requests.beProjectContentBlocks);
    const { promise } = dispatch(contentBlocksRequest);
    return promise;
  }

  static fetchData = (getState, dispatch, location, match) => {
    if (!match || !match.params || !match.params.id) return;
    return Promise.all([
      ProjectContentContainer.fetchContentBlocks(match.params.id, dispatch),
      ProjectContentContainer.fetchActionCallouts(match.params.id, dispatch)
    ]);
  };

  static mapStateToProps = state => {
    return {
      contentBlocks: select(requests.beProjectContentBlocks, state.entityStore),
      contentBlocksResponse: get(
        state.entityStore.responses,
        requests.beProjectContentBlocks
      ),
      actionCallouts: select(
        requests.beProjectActionCallouts,
        state.entityStore
      ),
      actionCalloutsResponse: get(
        state.entityStore.responses,
        requests.beProjectActionCallouts
      )
    };
  };

  static propTypes = {
    project: PropTypes.object,
    contentBlocks: PropTypes.array,
    contentBlocksResponse: PropTypes.object,
    actionCallouts: PropTypes.array,
    actionCalloutsResponse: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    route: PropTypes.object
  };

  get drawerProps() {
    const { project } = this.props;

    return {
      closeUrl: lh.link("backendProjectLayout", project.id),
      lockScroll: "always"
    };
  }

  get projectId() {
    return this.props.project.id;
  }

  fetchActionCallouts = () => {
    ProjectContentContainer.fetchActionCallouts(
      this.projectId,
      this.props.dispatch
    );
  };

  fetchContentBlocks = () => {
    ProjectContentContainer.fetchContentBlocks(
      this.projectId,
      this.props.dispatch
    );
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <Hero.Builder
          dispatch={this.props.dispatch}
          history={this.props.history}
          actionCallouts={this.props.actionCallouts}
          actionCalloutsResponse={this.props.actionCalloutsResponse}
          refresh={this.fetchActionCallouts}
          project={project}
        />
        <ContentBlock.Builder
          dispatch={this.props.dispatch}
          history={this.props.history}
          project={project}
          contentBlocks={this.props.contentBlocks}
          contentBlocksResponse={this.props.contentBlocksResponse}
          refresh={this.fetchContentBlocks}
        >
          {(closeCallback, pendingBlock) =>
            childRoutes(this.props.route, {
              childProps: { pendingBlock, project },
              drawer: true,
              drawerProps: { wide: true, closeCallback, ...this.drawerProps }
            })
          }
        </ContentBlock.Builder>
      </Authorize>
    );
  }
}

export default connectAndFetch(ProjectContentContainer);
