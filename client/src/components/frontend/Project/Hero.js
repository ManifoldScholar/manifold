import React, { Component } from "react";
import PropTypes from "prop-types";
import { Maker } from "components/frontend";
import { Helper } from "components/global";
import { Link } from "react-router-dom";
import has from "lodash/has";
import get from "lodash/get";
import lh from "helpers/linkHandler";

export default class ProjectHero extends Component {
  static displayName = "Project.Hero";

  static propTypes = {
    project: PropTypes.object
  };

  listMakers() {
    const creators = get(this.props.project, "relationships.creators");
    if (creators && creators.length > 0) {
      return (
        <section className="project-makers">
          {this.props.project.relationships.creators.map(creator => {
            return <Maker.Avatar key={creator.id} maker={creator} />;
          })}
        </section>
      );
    }
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
      output = <img src={attr.coverStyles.medium} alt="project-cover" />;

      if (wrapperClass) {
        output = (
          <div className={wrapperClass}>
            {output}
          </div>
        );
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
        <span className="hashtag">
          {hashtag}
        </span>
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
                    <i className={`manicon manicon-${service}`} />
                    <span className="screen-reader-text">{`View this project on ${service}`}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
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
          to={lh.link("reader", publishedText.id)}
          className="button-secondary"
        >
          <i className="manicon manicon-glasses" />
          {"Start Reading"}
        </Link>
        {publishedTextTocId
          ? <Link
              to={lh.link(
                "readerSection",
                publishedText.id,
                publishedTextTocId
              )}
              className="button-secondary dull"
            >
              <i className="manicon manicon-bullet-list" />
              {"View Contents"}
            </Link>
          : null}
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
          {"Buy "} {attr.purchaseVersionLabel}
        </span>
        <span className="tag">
          {attr.purchasePriceMoney}
        </span>
      </a>
    );
  }

  render() {
    const attr = this.props.project.attributes;
    const heroStyle = {};
    if (attr.heroStyles.largeLandscape) {
      heroStyle.backgroundImage = `url(${attr.heroStyles.largeLandscape})`;
    }

    return (
      <section className="project-detail-hero hero-image" style={heroStyle}>
        <div className="container">
          <div className="project-figure">
            {this.listMakers()}
            {this.renderProjectImage("image")}
            <h1 className="project-title">
              {attr.title}
              <span className="subtitle">
                {attr.subtitle}
              </span>
            </h1>
          </div>
          <div className="project-info">
            {this.renderPublishedText("top")}
            {this.listMakers()}
            <h1 className="project-title">
              {attr.title}
              <span className="subtitle">
                {attr.subtitle}
              </span>
            </h1>
            {this.renderDescription()}
            {this.renderSocial()}
            {this.renderPublishedText("bottom")}
            {this.renderPurchaseLink()}
          </div>
          <div className="project-aside">
            {this.renderProjectImage()}
            {this.renderPurchaseLink()}
          </div>
        </div>
      </section>
    );
  }
}
