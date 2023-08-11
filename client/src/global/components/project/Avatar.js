import React, { Component } from "react";
import PropTypes from "prop-types";
import UniqueIcons from "global/components/icon/unique";

export default class ProjectAvatar extends Component {
  static displayName = "Project.Avatar";

  static propTypes = {
    project: PropTypes.object
  };

  renderAvatarImage(project) {
    if (!project.attributes.avatarMeta.original) return null;
    const meta = project.attributes.avatarMeta.original;
    const imageStyle =
      meta.width >= meta.height
        ? project.attributes.avatarStyles.smallSquare
        : project.attributes.avatarStyles.small;
    const alt = project.attributes.avatarAltText;
    return <img src={imageStyle} alt={alt ?? ""} />;
  }

  renderPlaceholderImage(project) {
    if (!project.attributes.avatarColor) return null;
    return (
      <>
        <UniqueIcons.ProjectPlaceholderUnique
          mode="responsive"
          color={project.attributes.avatarColor}
          ariaLabel={false}
        />
      </>
    );
  }

  render() {
    const project = this.props.project;
    if (!project) return null;

    return project.attributes.avatarStyles.original
      ? this.renderAvatarImage(project)
      : this.renderPlaceholderImage(project);
  }
}
