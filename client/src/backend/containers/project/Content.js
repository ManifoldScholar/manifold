import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ContentBlock from "backend/components/content-block";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { connect } from "react-redux";
import Authorize from "hoc/authorize";
import { select } from "utils/entityUtils";
import get from "lodash/get";

const { request } = entityStoreActions;

export class ProjectContentContainer extends PureComponent {
  static displayName = "Project.ContentContainer";

  static mapStateToProps = state => {
    return {
      contentBlocks: select(requests.beProjectContentBlocks, state.entityStore),
      contentBlocksResponse: get(
        state.entityStore.responses,
        requests.beProjectContentBlocks
      )
    };
  };

  static propTypes = {
    project: PropTypes.object,
    contentBlocks: PropTypes.array,
    contentBlocksResponse: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    route: PropTypes.object
  };

  componentDidMount() {
    this.fetchContentBlocks();
  }

  get projectId() {
    return this.props.project.id;
  }

  get drawerProps() {
    const { project } = this.props;

    return {
      closeUrl: lh.link("backendProjectProjectPage", project.id),
      lockScroll: "always"
    };
  }

  fetchContentBlocks = () => {
    const call = projectsAPI.contentBlocks(this.projectId);
    const contentBlocksRequest = request(call, requests.beProjectContentBlocks);
    this.props.dispatch(contentBlocksRequest);
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

export default connect(ProjectContentContainer.mapStateToProps)(
  ProjectContentContainer
);
