import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ContentBlock from "backend/components/content-block";
import Hero from "backend/components/hero";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import Authorize from "hoc/Authorize";
import { select } from "utils/entityUtils";
import get from "lodash/get";

const { request } = entityStoreActions;

export class ProjectLayoutContainer extends PureComponent {
  static displayName = "Project.Layout";

  static mapStateToProps = state => {
    return {
      contentBlocks: select(requests.beProjectContentBlocks, state.entityStore),
      contentBlocksResponse: get(
        state.entityStore.responses,
        requests.beProjectContentBlocks
      ),
      actionCallouts: select(requests.beActionCallouts, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    contentBlocks: PropTypes.array,
    contentBlocksResponse: PropTypes.object,
    actionCallouts: PropTypes.array,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    route: PropTypes.object,
    refresh: PropTypes.func
  };

  static fetchData = (getState, dispatch, location, match) => {
    if (!match || !match.params || !match.params.id) return;
    return Promise.all([
      ProjectLayoutContainer.fetchContentBlocks(match.params.id, dispatch),
      ProjectLayoutContainer.fetchActionCallouts(match.params.id, dispatch)
    ]);
  };

  static fetchContentBlocks(projectId, dispatch) {
    const call = projectsAPI.contentBlocks(projectId);
    const contentBlocksRequest = request(call, requests.beProjectContentBlocks);
    const { promise } = dispatch(contentBlocksRequest);
    return promise;
  }

  static fetchActionCallouts(projectId, dispatch) {
    const call = projectsAPI.actionCallouts(projectId);
    const actionCalloutsRequest = request(call, requests.beActionCallouts);
    const { promise } = dispatch(actionCalloutsRequest);
    return promise;
  }

  get projectId() {
    return this.props.project.id;
  }

  get drawerProps() {
    const { project } = this.props;

    return {
      closeUrl: lh.link("backendProjectLayout", project.id),
      lockScroll: "always"
    };
  }

  fetchContentBlocks = () => {
    ProjectLayoutContainer.fetchContentBlocks(
      this.projectId,
      this.props.dispatch
    );
  };

  fetchActionCallouts = () => {
    ProjectLayoutContainer.fetchActionCallouts(
      this.projectId,
      this.props.dispatch
    );
  };

  render() {
    const {
      dispatch,
      history,
      actionCallouts,
      refresh,
      contentBlocks,
      contentBlocksResponse,
      route
    } = this.props;
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
          include={["projectDescription", "actionCallouts", "social"]}
          dispatch={dispatch}
          history={history}
          actionCallouts={actionCallouts}
          refresh={refresh}
          refreshActionCallouts={this.fetchActionCallouts}
          model={project}
          withDarkMode={!project.attributes.isJournalIssue}
        />
        <ContentBlock.Builder
          dispatch={dispatch}
          history={history}
          project={project}
          contentBlocks={contentBlocks}
          contentBlocksResponse={contentBlocksResponse}
          refresh={this.fetchContentBlocks}
        >
          {(closeCallback, pendingBlock) =>
            childRoutes(route, {
              childProps: {
                pendingBlock,
                project,
                refreshActionCallouts: this.fetchActionCallouts,
                calloutable: project,
                closeRoute: "backendProjectLayout"
              },
              drawer: true,
              drawerProps: { wide: true, closeCallback, ...this.drawerProps }
            })
          }
        </ContentBlock.Builder>
      </Authorize>
    );
  }
}

export default connectAndFetch(ProjectLayoutContainer);
