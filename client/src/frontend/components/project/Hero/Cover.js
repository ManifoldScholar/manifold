import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ThumbnailColor from "global/components/svg/ThumbnailColor";

export default class ProjectHeroCover extends PureComponent {
  static displayName = "ProjectHero.Cover";

  static propTypes = {
    blockClass: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string
  };

  renderCoverImage() {
    return (
      <figure className={`${this.props.blockClass}__figure`}>
        <img
          className={`${this.props.blockClass}__cover-image`}
          src={this.props.src}
          alt={this.props.alt}
        />
      </figure>
    );
  }

  renderPlaceholder() {
    return (
      <figure className={`${this.props.blockClass}__figure`}>
        <ThumbnailColor iconClass={`${this.props.blockClass}__cover-icon`} />
      </figure>
    );
  }

  render() {
    return (
      <div className={`${this.props.blockClass}__cover-block`}>
        {this.props.src ? this.renderCoverImage() : this.renderPlaceholder()}
      </div>
    );
  }
}
