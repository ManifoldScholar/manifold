import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

export default class ProjectHeroSocial extends PureComponent {
  static displayName = "ProjectHero.Social";

  static propTypes = {
    wrapperClassName: PropTypes.string,
    blockClass: PropTypes.string,
    project: PropTypes.object.isRequired
  };

  get attributes() {
    return this.props.project.attributes;
  }

  get hashtag() {
    return this.props.project.attributes.hashtag;
  }

  get services() {
    return ["twitter", "facebook", "instagram"];
  }

  get renderable() {
    if (
      this.services.some(service => {
        return !!this.serviceId(service);
      })
    )
      return true;
    return !!this.hashtag;
  }

  serviceId(service) {
    const key = `${service}Id`;
    return this.attributes[key];
  }

  socialUrl(service, id) {
    let out;
    switch (service) {
      case "twitter":
        out = `https://twitter.com/${id}`;
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
    const id = this.serviceId(service);
    if (!id) return null;

    return (
      <a
        key={index}
        target="_blank"
        rel="noopener noreferrer"
        href={this.socialUrl(service, id)}
        className={`${this.props.blockClass}__social-link`}
      >
        <IconComputed.Social icon={service} size={32} />
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
    if (!this.renderable) return null;
    return (
      <div className={this.props.wrapperClassName}>
        <div className={`${this.props.blockClass}__social-block`}>
          {this.services.map((service, index) =>
            this.renderService(service, index)
          )}
          {this.hashtag && this.renderHashtag()}
        </div>
      </div>
    );
  }
}
