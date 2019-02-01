import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import has from "lodash/has";
import Utility from "global/components/utility";

export default class ProjectHeroSocial extends PureComponent {
  static displayName = "ProjectHero.Social";

  static propTypes = {
    blockClass: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  get attributes() {
    return this.props.project.attributes;
  }

  get hashtag() {
    return this.props.project.attributes.hashtag;
  }

  socialUrl(service, id) {
    let out;
    switch (service) {
      case "twitter":
        out = `https://twitter.com/hashtag/${id}`;
        break;
      case "instagram":
        out = `https://instagram.com/${id}`;
        break;
      case "facebook":
        out = `https://facebook.com/${id}`;
        break;
      default:
        out = null;
        break;
    }
    return out;
  }

  renderService(service, index) {
    const key = `${service}Id`;
    if (!has(this.attributes, key) || !this.attributes[key]) return null;

    return (
      <a
        key={index}
        target="_blank"
        rel="noopener noreferrer"
        href={this.socialUrl(service, this.attributes[key])}
        className={`${this.props.blockClass}__social-link`}
      >
        <Utility.IconComposer icon={`social-${service}`} size={32} />
        <span className="screen-reader-text">
          {`View this project on ${service}`}
        </span>
      </a>
    );
  }

  renderHashtag() {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/hashtag/${this.hashtag}`}
        className={`${this.props.blockClass}__hashtag`}
      >
        {`#${this.hashtag}`}
      </a>
    );
  }

  render() {
    const services = ["twitter", "facebook", "instagram"];
    if (!has(this.attributes, services) && !this.hashtag) return null;

    return (
      <div className={`${this.props.blockClass}__social-block`}>
        {services.map((service, index) => this.renderService(service, index))}
        {this.hashtag && this.renderHashtag()}
      </div>
    );
  }
}
