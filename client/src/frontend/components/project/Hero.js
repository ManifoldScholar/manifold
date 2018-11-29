import React, { Component } from "react";
import PropTypes from "prop-types";
import Maker from "frontend/components/maker";
import Helper from "global/components/helper";
import { Link } from "react-router-dom";
import has from "lodash/has";
import some from "lodash/some";
import isEmpty from "lodash/isEmpty";
import lh from "helpers/linkHandler";
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

  renderPublishedText(project, position) {
    const publishedText = project.relationships.publishedText;
    const publishedTextTocId = project.attributes.publishedTextTocId;
    if (!publishedText) return null;

    return (
      <section className={"project-entry " + position}>
        <Link
          to={lh.link("reader", publishedText.attributes.slug)}
          className="button-secondary"
        >
          <i className="manicon manicon-glasses" aria-hidden="true" />
          <span>{"Start Reading"}</span>
        </Link>
        {publishedTextTocId ? (
          <Link
            to={lh.link(
              "readerSection",
              publishedText.attributes.slug,
              publishedTextTocId
            )}
            className="button-secondary dull"
          >
            <i className="manicon manicon-bullet-list" aria-hidden="true" />
            <span>{"View Contents"}</span>
          </Link>
        ) : null}
      </section>
    );
  }

  renderPurchaseLink(attr) {
    if (!attr.purchaseUrl) return null;

    return (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={attr.purchaseUrl}
        className="button-tagged outline"
      >
        <span className="text">
          {attr.purchaseCallToAction || "Buy Print Version"}
        </span>
        <span className="tag">{attr.purchasePriceMoney}</span>
      </a>
    );
  }

  renderDownloadLink(attr) {
    if (!attr.publishedTextDownloadUrl) return null;

    const purchaseLinkPresent = this.renderPurchaseLink(attr);

    const buttonClasses = purchaseLinkPresent
      ? "utility-primary"
      : "button-tagged outline";

    return (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={attr.publishedTextDownloadUrl}
        className={buttonClasses}
      >
        {purchaseLinkPresent ? (
          <i className="manicon manicon-arrow-down" />
        ) : null}
        <span className="text">
          {attr.downloadCallToAction || "Download eBook"}
        </span>
        {purchaseLinkPresent ? null : (
          <span className="tag">
            <i className="manicon manicon-arrow-down" />
          </span>
        )}
      </a>
    );
  }

  renderPublishedTextLinks(attr) {
    if (!attr.purchaseUrl && !attr.publishedTextDownloadUrl) return null;

    return (
      <React.Fragment>
        {this.renderPurchaseLink(attr)}
        {this.renderDownloadLink(attr)}
      </React.Fragment>
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
            {this.renderPublishedText(project, "top")}
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
            {this.renderPublishedText(project, "bottom")}
            {this.renderSocial(attr)}
            {this.renderPublishedTextLinks(attr)}
          </div>
          <div className="project-aside">
            {this.renderProjectImage(attr.coverStyles)}
            {this.renderPublishedTextLinks(attr)}
          </div>
        </div>
      </div>
    );
  }
}
