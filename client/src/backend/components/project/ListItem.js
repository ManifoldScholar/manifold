import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProjectPlaceholder from "global/components/svg/ProjectPlaceholder";
import lh from "helpers/linkHandler";

export default class ProjectListItem extends PureComponent {
  static displayName = "Project.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    placeholderMode: PropTypes.string
  };

  static defaultProps = {
    placeholderMode: "responsive"
  };

  projectLink(project) {
    if (
      project.attributes.abilities.update === true ||
      project.attributes.abilities.manageResources === true
    ) {
      return lh.link("backendProject", project.id);
    }
    return lh.link("frontendProject", project.id);
  }

  renderProjectMakers(makers) {
    let output = null;
    if (makers && makers.length > 0) {
      output = (
        <div className="relations-list">
          {makers.map((maker, i) => {
            let nameList = maker.attributes.fullName;
            if (i > 0) nameList = ", " + nameList;
            return nameList;
          })}
        </div>
      );
    }

    return output;
  }

  renderProjectStatusMarker(attr) {
    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (attr.draft) {
      marker = <div className="block-label">{"Draft"}</div>;
    }

    return marker;
  }

  renderProjectImage(project) {
    const meta = project.attributes.avatarMeta.original;
    const hasAvatarStyles = project.attributes.avatarStyles.original;
    const avatarColor = project.attributes.avatarColor;

    if (!meta || !hasAvatarStyles) {
      return (
        <ProjectPlaceholder
          mode={this.props.placeholderMode}
          color={avatarColor}
          ariaLabel={false}
        />
      );
    }

    const imageStyle =
      meta.width >= meta.height
        ? project.attributes.avatarStyles.smallSquare
        : project.attributes.avatarStyles.small;

    return <img src={imageStyle} alt="" />;
  }

  render() {
    const project = this.props.entity;
    const attr = project.attributes;
    return (
      <li key={project.id}>
        <Link
          to={this.projectLink(project)}
          aria-describedby={`${project.id}-description`}
        >
          <figure className="cover">{this.renderProjectImage(project)}</figure>
          <div className="meta">
            <div className="name">
              <span
                className="title-text"
                dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
              />
              {this.renderProjectStatusMarker(attr)}
              <span className="subtitle">{attr.subtitle}</span>
            </div>
            {this.renderProjectMakers(project.relationships.creators)}
          </div>
          <span
            id={`${project.id}-description`}
            className="aria-describedby"
          >{`View ${project.attributes.titlePlaintext}`}</span>
        </Link>
      </li>
    );
  }
}
