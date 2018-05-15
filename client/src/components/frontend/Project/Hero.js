import React, { Component } from "react";
import PropTypes from "prop-types";
import { Maker } from "components/frontend";
import { Helper } from "components/global";
import { Link } from "react-router-dom";
import has from "lodash/has";
import some from "lodash/some";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
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

  hasMakers(type) {
    return !isEmpty(get(this.props.project, `relationships.${type}`));
  }

  listCreators() {
    if (!this.hasMakers("creators")) return null;
    const creators = get(this.props.project, "relationships.creators");

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

  listContributors() {
    if (!this.hasMakers("contributors")) return null;
    const contributors = get(this.props.project, "relationships.contributors");

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

  listMakers() {
    return (
      <section className="project-maker">
        {this.listCreators()}
        {this.listContributors()}
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

  renderProjectStatusMarker() {
    const project = this.props.project;

    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (project.attributes.draft) {
      marker = <div className="block-label">{"Draft"}</div>;
    }

    return marker;
  }

  renderDescription() {
    const attr = this.props.project.attributes;
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

  renderProjectImage(wrapperClass) {
    let output = "";
    const attr = this.props.project.attributes;

    if (attr.coverStyles.medium) {
      output = <img src={attr.coverStyles.medium} alt="Project Cover" />;

      if (wrapperClass) {
        output = <div className={wrapperClass}>{output}</div>;
      }
    }

    return output;
  }

  renderSocial() {
    const attr = this.props.project.attributes;
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

  renderPublishedText(position) {
    const publishedText = this.props.project.relationships.publishedText;
    const publishedTextTocId = this.props.project.attributes.publishedTextTocId;
    if (!publishedText) return null;
    return (
      <section className={"project-entry " + position}>
        <Link
          to={lh.link("reader", publishedText.attributes.slug)}
          className="button-secondary"
        >
          <i className="manicon manicon-glasses" aria-hidden="true" />
          {"Start Reading"}
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
            {"View Contents"}
          </Link>
        ) : null}
      </section>
    );
  }

  renderPurchaseLink() {
    const attr = this.props.project.attributes;
    if (!attr.purchaseUrl) return null;
    return (
      <a
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
  render() {
    const attr = this.props.project.attributes;

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
                <span className="title-text">{attr.title}</span>
                {this.renderProjectStatusMarker()}
                <span className="subtitle">{attr.subtitle}</span>
              </h1>
              {this.listMakers()}
            </div>
          </div>
          <div className="project-info">
            {this.renderPublishedText("top")}
            <h1 className="project-title">
              <span className="title-text">{attr.title}</span>
              {this.renderProjectStatusMarker()}
              <span className="subtitle">{attr.subtitle}</span>
            </h1>
            {this.listMakers()}
            {this.renderDescription()}
            {this.renderPublishedText("bottom")}
            {this.renderSocial()}
            {this.renderPurchaseLink()}
          </div>
          <div className="project-aside">
            {this.renderProjectImage()}
            {this.renderPurchaseLink()}
          </div>
        </div>
      </div>
    );
  }
}
