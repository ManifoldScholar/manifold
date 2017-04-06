import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Project as FrontEndProject } from 'components/frontend';
import { Project as GlobalProject } from 'components/global';
import FormattedDate from 'components/global/FormattedDate';
import classNames from 'classnames';
import { linkHelpers as lh } from 'routes';

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

  renderProjectMakers(project) {
    const creators = project.relationships.creators;
    if (!creators || creators.length === 0) return null;
    return (
      <div className="makers">
        <span>{creators.map((maker) => maker.attributes.fullName).join(", ")}</span>
      </div>
    );
  }

  renderUpdatedDate(project) {
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

    let projectDesc = null;
    if (!this.props.hideDesc) {
      projectDesc = (
        <p className="description">
          {project.attributes.subtitle}
        </p>
      );
    }

    let projectMeta = null;
    if (!this.props.hideMeta) {
      projectMeta = (
        <div className="meta">
          <h3 className="title">{project.attributes.title}</h3>
          {this.renderProjectMakers(project)}
          { project.attributes.updated ?
            this.renderUpdatedDate(project)
          : this.renderPublishedDate(project)
          }
          {this.renderProjectDesc(project)}
        </div>
      );
    }

    let cover;
    let className;
    if (project.attributes.avatarStyles.small) {
      className = "figure-wrapper";
      cover = (
        <img src={project.attributes.avatarStyles.small}
          alt={`Click to view ${project.attributes.title}`}
        />
      );
    } else {
      className = "figure-wrapper figure-wrapper-placeholder";
      cover = <GlobalProject.Placeholder />;
    }

    return (
      <Link
        to={lh.frontendProject(project.id)}
      >
        {/* Figure wrapper, controls maximum width of figure */}
        <div className={className} >
          <figure>
            {cover}
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
