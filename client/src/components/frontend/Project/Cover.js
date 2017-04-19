import React, { Component, PropTypes } from 'react';
import { Project } from 'components/global';

export default class ProjectCover extends Component {

  static displayName = "Project.Cover";

  static propTypes = {
    project: PropTypes.object
  };

  renderCoverImage(project) {
    if (!project.attributes.avatarStyles.small) return null;
    return (
      <img
        src={project.attributes.avatarStyles.small}
        alt={`Click to view ${project.attributes.title}`}
      />
    );
  }

  renderPlaceholderImage(project) {
    if (!project.attributes.avatarColor) return null;
    return (
      <Project.Placeholder
        color={project.attributes.avatarColor}
      />
    );
  }

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      project.attributes.avatarStyles.small ?
        this.renderCoverImage(project)
        : this.renderPlaceholderImage(project)
    );
  }
}

