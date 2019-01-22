import React, { Component } from "react";
import PropTypes from "prop-types";
import Maker from "frontend/components/maker";
import Helper from "global/components/helper";
import has from "lodash/has";
import some from "lodash/some";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";

export default class ProjectHero extends Component {
  static displayName = "Project.Hero";

  static propTypes = {
    project: PropTypes.object
  };

  hasAvatars(creators, variant) {
    return !some(creators, c => isEmpty(c.attributes.avatarStyles[variant]));
  }

  listCreators(creators) {
    if (!creators || !creators.length > 0) return null;

    if (creators.length <= 2 && this.hasAvatars(creators, "smallSquare")) {
      return (
        <div className="project-creator-avatars">
          {creators.map(creator => {
            return <Maker.Avatar key={creator.id} maker={creator} />;
          })}
        </div>
      );
    }

    return (
      <div className="project-creator-list">
        <ul>
          {creators.map(creator => {
            return <li key={creator.id}>{creator.attributes.fullName}</li>;
          })}
        </ul>
      </div>
    );
  }

  listContributors(contributors) {
    if (!contributors || !contributors.length > 0) return null;

    return (
      <div className="project-contributor-list">
        <span className="label">{"Contributors: "}</span>
        <ul>
          {contributors.map(creator => {
            return <li key={creator.id}>{creator.attributes.fullName}</li>;
          })}
        </ul>
      </div>
    );
  }

  listMakers(relationships) {
    return (
      <section className="project-maker">
        {this.listCreators(relationships.creators)}
        {this.listContributors(relationships.contributors)}
      </section>
    );
  }

  socialUrl(service, id) {
    let out;
    switch (service) {
      case "twitter":
        out = `http://twitter.com/${id}`;
        break;
      case "instagram":
        out = `http://instagram.com/${id}`;
        break;
      case "facebook":
        out = `http://facebook.com/${id}`;
        break;
      default:
        out = null;
        break;
    }
    return out;
  }

  renderProjectStatusMarker(attr) {
    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (attr.draft) {
      marker = <div className="block-label">{"Draft"}</div>;
    }

    return marker;
  }

  renderDescription(attr) {
    if (attr.description) {
      if (attr.descriptionFormatted) {
        return (
          <section
            className="project-summary"
            dangerouslySetInnerHTML={{ __html: attr.descriptionFormatted }}
          />
        );
      }
      return (
        <section className="project-summary">
          <Helper.SimpleFormat text={attr.description} />
        </section>
      );
    }
  }

  renderProjectImage(coverStyles, wrapperClass = null) {
    let output = "";

    if (coverStyles.medium) {
      output = <img src={coverStyles.medium} alt="Project Cover" />;

      if (wrapperClass) {
        output = <div className={wrapperClass}>{output}</div>;
      }
    }

    return output;
  }

  renderSocial(attr) {
    const services = ["twitter", "facebook", "instagram"];
    const hashtag = attr.hashtag ? `#${attr.hashtag}` : null;

    return (
      <section className="project-social">
        <nav className="networks">
          <ul>
            {services.map(service => {
              const key = `${service}Id`;
              if (!has(attr, key) || !attr[key]) return null;
              return (
                <li key={service}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.socialUrl(service, attr[key])}
                    className={service}
                  >
                    <i
                      className={`manicon manicon-${service}`}
                      aria-hidden="true"
                    />
                    <span className="screen-reader-text">{`View this project on ${service}`}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <span className="hashtag">{hashtag}</span>
      </section>
    );
  }

  renderProjectSubtitle(attr) {
    if (!attr.subtitle) return null;
    if (attr.subtitleFormatted)
      return (
        <span
          className="subtitle"
          dangerouslySetInnerHTML={{ __html: attr.subtitleFormatted }}
        />
      );

    return <span className="subtitle">{attr.subtitle}</span>;
  }

  render() {
    const project = this.props.project;
    if (!project) return null;

    const attr = project.attributes;

    const heroClass = classNames("project-detail-hero", {
      "hero-image": attr.heroStyles.largeLandscape
    });

    const heroStyle = {};
    if (attr.heroStyles.largeLandscape) {
      heroStyle.backgroundImage = `url(${attr.heroStyles.largeLandscape})`;
    }

    return (
      <div className={heroClass} style={heroStyle}>
        <div className="container">
          <div className="project-figure">
            {this.renderProjectImage("image")}
            <div className="project-figure-caption">
              <h1 className="project-title">
                <span
                  className="title-text"
                  dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
                />
                {this.renderProjectStatusMarker(attr)}
                {this.renderProjectSubtitle(attr)}
              </h1>
              {this.listMakers(project.relationships)}
            </div>
          </div>
          <div className="project-info">
            <h1 className="project-title">
              <span
                className="title-text"
                dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
              />
              {this.renderProjectStatusMarker(attr)}
              {this.renderProjectSubtitle(attr)}
            </h1>
            {this.listMakers(project.relationships)}
            {this.renderDescription(attr)}
            {this.renderSocial(attr)}
          </div>
          <div className="project-aside">
            {this.renderProjectImage(attr.coverStyles)}
          </div>
        </div>
      </div>
    );
  }
}
