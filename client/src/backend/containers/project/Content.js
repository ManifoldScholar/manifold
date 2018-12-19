import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Content from "backend/components/project/Content";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { connect } from "react-redux";

import Authorize from "hoc/authorize";

export class ProjectContentContainer extends PureComponent {
  static displayName = "Project.ContentContainer";

  static propTypes = {
    project: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    route: PropTypes.object
  };

  get childProps() {
    const { location, match, history, dispatch } = this.props;

    return {
      location,
      match,
      history,
      dispatch
    }
  }

  get drawerProps() {
    const { project } = this.props;

    return {
      closeUrl: lh.link("backendProjectProjectPage", project.id)
    };
  }

  // TODO: Pass the actual project to the Content component
  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <Content { ...this.childProps }>
          {(closeCallback, pendingBlock) =>
            childRoutes(this.props.route, { childProps: { pendingBlock }, drawer: true, drawerProps: { closeCallback, ...this.drawerProps } })
          }
        </Content>
      </Authorize>
    );
  }
}

export default connect(ProjectContentContainer.mapStateToProps)(ProjectContentContainer);
