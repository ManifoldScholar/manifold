import React, { Component } from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";

export default class ProjectDetailContainer extends Component {
  static propTypes = {
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func,
    standaloneMode: PropTypes.bool
  };

  render() {
    if (!this.props.projectResponse) return null;
    if (this.props.projectResponse.status === 401)
      return <Redirect to={lh.link("frontend")} />;
    const { project, settings } = this.props;
    if (!project) return null;

    return (
      <div className="project-detail">
        <HeadContent
          title={`\u201c${
            this.props.project.attributes.titlePlaintext
          }\u201d on ${settings.attributes.general.installationName}`}
          description={this.props.project.attributes.description}
          image={this.props.project.attributes.heroStyles.medium}
        />
        <Project.Detail
          project={this.props.project}
          dispatch={this.props.dispatch}
          standaloneMode={this.props.standaloneMode}
        />
      </div>
    );
  }
}
