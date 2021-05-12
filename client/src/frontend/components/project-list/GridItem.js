import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GlobalProject from "global/components/project";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import has from "lodash/has";
import Collecting from "frontend/components/collecting";

export default class ProjectGridItem extends Component {
  static displayName = "Project.GridItem";

  static propTypes = {
    project: PropTypes.object,
    onUncollect: PropTypes.func,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool
  };

  shouldShowUpdated(project) {
    const { updated, finished } = project.attributes;
    return !finished && Boolean(updated);
  }

  renderPublishedDate(project) {
    const attr = project.attributes;
    if (attr.publicationDate && !this.props.hideDate) {
      return (
        <div className="date" aria-hidden>
          <FormattedDate
            prefix="Published"
            format="MMMM, yyyy"
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
      <p className="description" aria-hidden>
        {project.attributes.subtitle}
      </p>
    );
  }

  renderProjectStatusMarker(project) {
    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (project.attributes.draft) {
      marker = (
        <div className="block-label" aria-hidden>
          {"Draft"}
        </div>
      );
    }

    return marker;
  }

  renderProjectMakers(project) {
    let names;
    if (has(project.attributes, "creatorNames")) {
      names = project.attributes.creatorNames;
    } else if (
      project.relationships.creators &&
      project.relationships.creators.length > 0
    ) {
      names = project.relationships.creators
        .map(maker => maker.attributes.fullName)
        .join(", ");
    }

    if (!names) return null;

    return (
      <div className="relations-list" aria-hidden>
        <span>{names}</span>
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
      <div className={classes} aria-hidden>
        <FormattedDate
          prefix="Updated"
          format="MMMM, yyyy"
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
          <h3 className="name">
            <span
              className="title-text"
              dangerouslySetInnerHTML={{
                __html: project.attributes.titleFormatted
              }}
            />
            {this.renderProjectStatusMarker(project)}
          </h3>
          {this.renderProjectMakers(project)}
          {this.shouldShowUpdated(project)
            ? this.renderUpdatedDate(project)
            : this.renderPublishedDate(project)}
          {this.renderProjectDesc(project)}
        </div>
      );
    }

    const figureClass = classNames("cover", {
      "cover-placeholder": !project.attributes.avatarStyles.small,
      dim: project.attributes.draft
    });

    return (
      <>
        <Link to={lh.link("frontendProjectDetail", project.attributes.slug)}>
          <figure className={figureClass}>
            <GlobalProject.Avatar project={project} />
          </figure>
          {projectMeta}
        </Link>
        <Collecting.Toggle
          collectable={project}
          onUncollect={this.props.onUncollect}
          inline={false}
          outlined={false}
        />
      </>
    );
  }
}
