import React, { Component, PropTypes } from 'react';
import { Project } from 'components/global';

export default class ProjectCover extends Component {

  static displayName = "Project.Cover";

  static propTypes = {
    project: PropTypes.object
  };

  renderAvatarImage(project) {
    if (!project.attributes.avatarMeta.original) return null;
    const meta = project.attributes.avatarMeta.original;
    const imageStyle = meta.width >= meta.height ? project.attributes.avatarStyles.smallSquare
      : project.attributes.avatarStyles.small;
    return (
      <img
        src={imageStyle}
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
      project.attributes.avatarStyles.original ?
        this.renderAvatarImage(project)
        : this.renderPlaceholderImage(project)
    );
  }
}

