import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Project as FrontEndProject } from "components/frontend";
import FormattedDate from "components/global/FormattedDate";
import classNames from "classnames";
import lh from "helpers/linkHandler";
// import { Project as GlobalProject } from 'components/global';

export default class ProjectThumbnail extends Component {
  static displayName = "Project.Thumbnail";

  static propTypes = {
    project: PropTypes.object,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    hideMeta: false,
    hideDate: false,
    hideDesc: false
  };

  renderPublishedDate(project) {
    const attr = project.attributes;
    if (attr.publicationDate && !this.props.hideDate) {
      return (
        <div className="date">
          <FormattedDate
            prefix="Published"
            format="MMMM, YYYY"
            date={attr.publicationDate}
          />
        </div>
      );
    }
    return null;
  }

  renderProjectDesc(project) {
    if (this.props.hideDesc || !project.attributes.subtitle) return null;
    return (
      <p className="description">
        {project.attributes.subtitle}
      </p>
    );
  }

  renderProjectStatusMarker(project) {
    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (project.attributes.draft) {
      marker = (
        <div className="block-label">
          {"Draft"}
        </div>
      );
    }

    return marker;
  }

  renderProjectMakers(project) {
    const creators = project.relationships.creators;
    if (!creators || creators.length === 0) return null;
    return (
      <div className="makers">
        <span>
          {creators.map(maker => maker.attributes.fullName).join(", ")}
        </span>
      </div>
    );
  }

  renderUpdatedDate(project) {
    if (project.attributes.draft) return null;
    const classes = classNames({
      date: true,
      alert: project.attributes.recentlyUpdated
    });
    return (
      <div className={classes}>
        <FormattedDate
          prefix="Updated"
          format="MMMM, YYYY"
          date={project.attributes.updatedAt}
        />
      </div>
    );
  }

  render() {
    const project = this.props.project;

    let projectMeta = null;
    if (!this.props.hideMeta) {
      projectMeta = (
        <div className="meta">
          <h3 className="title">
            {project.attributes.title}
          </h3>
          {this.renderProjectMakers(project)}
          {this.renderProjectStatusMarker(project)}
          {project.attributes.updated
            ? this.renderUpdatedDate(project)
            : this.renderPublishedDate(project)}
          {this.renderProjectDesc(project)}
        </div>
      );
    }

    const figureClass = classNames("figure-wrapper", {
      "figure-wrapper-placeholder": project.attributes.avatarStyles.small,
      dim: project.attributes.draft
    });

    return (
      <Link to={lh.link("frontendProject", project.attributes.slug)}>
        {/* Figure wrapper, controls maximum width of figure */}
        <div className={figureClass}>
          <figure>
            <FrontEndProject.Cover project={project} />
            <FrontEndProject.Follow
              project={project}
              authenticated={this.props.authenticated}
              favorites={this.props.favorites}
              dispatch={this.props.dispatch}
            />
          </figure>
        </div>
        {projectMeta}
      </Link>
    );
  }
}
