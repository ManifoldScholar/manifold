import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Project as GlobalProject } from "components/global";
import lh from "helpers/linkHandler";

export default class ProjectListItem extends PureComponent {
  static displayName = "Project.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

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
      marker = (
        <div className="block-label">
          {"Draft"}
        </div>
      );
    }

    return marker;
  }

  renderProjectImage(project) {
    if (project.attributes.coverStyles.smallPortrait) {
      return (
        <img
          src={project.attributes.coverStyles.smallPortrait}
          alt="project-cover"
        />
      );
    }
    if (project.attributes.avatarStyles.smallSquare) {
      return (
        <img
          src={project.attributes.avatarStyles.smallSquare}
          alt="project-cover"
        />
      );
    }
    return <GlobalProject.Placeholder />;
  }

  render() {
    const project = this.props.entity;
    const attr = project.attributes;
    return (
      <li key={project.id}>
        <Link to={lh.link("backendProject", project.id)}>
          <header>
            <figure className="cover">
              {this.renderProjectImage(project)}
            </figure>
            <div className="meta">
              <h3 className="name">
                <span className="title-text">
                  {attr.title}
                </span>
                {this.renderProjectStatusMarker(attr)}
                <span className="subtitle">
                  {attr.subtitle}
                </span>
              </h3>
              {this.renderProjectMakers(project.relationships.creators)}
            </div>
          </header>
          <span className="label">Edit</span>
        </Link>
      </li>
    );
  }
}
