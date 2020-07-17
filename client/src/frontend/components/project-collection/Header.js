import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComputed from "global/components/icon-computed";
import Constants from "./Constants";

const BLOCKCLASS = "project-collection-header";

export default class ProjectCollectionDetailHeader extends PureComponent {
  static displayName = "ProjectCollectionDetailHeader";

  static propTypes = {
    projectCollection: PropTypes.object.isRequired,
    hasLink: PropTypes.bool
  };

  static defaultProps = {
    hasLink: false
  };

  get projectCollection() {
    return this.props.projectCollection;
  }

  get collectionAttributes() {
    return this.projectCollection.attributes;
  }

  get iconFill() {
    if (this.collectionAttributes.icon === "new-round") {
      return "var(--accent-primary, #52e3ac)";
    }

    return "currentColor";
  }

  get title() {
    return (
      <h2 className={`${BLOCKCLASS}__title`}>
        {this.collectionAttributes.title}
      </h2>
    );
  }

  get description() {
    if (!this.collectionAttributes.descriptionFormatted) {
      return null;
    }

    return (
      <p className={`${BLOCKCLASS}_description`}>
        {this.collectionAttributes.descriptionFormatted}
      </p>
    );
  }

  get icon() {
    if (this.collectionAttributes.iconStyles) {
      return (
        <img
          className={`${BLOCKCLASS}__icon`}
          src={this.collectionAttributes.iconStyles.square}
          alt="square"
        />
      );
    }

    if (this.collectionAttributes.icon) {
      return (
        <IconComputed.ProjectCollection
          icon={this.collectionAttributes.icon}
          size={56}
          fill={this.iconFill}
        />
      );
    }

    return null;
  }

  get isIcon() {
    return !!(
      this.collectionAttributes.iconStyles || this.collectionAttributes.icon
    );
  }

  get isSquare() {
    return !!(
      this.collectionAttributes.heroStyles &&
      this.collectionAttributes.heroLayout === Constants.SQUARE
    );
  }

  get isWide() {
    return !!(
      this.collectionAttributes.heroStyles &&
      this.collectionAttributes.heroLayout === Constants.WIDE
    );
  }

  get isFull() {
    return !!(
      this.collectionAttributes.heroStyles &&
      this.collectionAttributes.heroLayout === Constants.FULL
    );
  }

  get iconTitle() {
    if (this.props.hasLink) {
      return (
        <Link
          className={`${BLOCKCLASS}_summary`}
          to={lh.link(
            "frontendProjectCollection",
            this.collectionAttributes.slug
          )}
        >
          <div className={`${BLOCKCLASS}__icon-title main`}>
            {this.icon}
            {this.title}
          </div>
        </Link>
      );
    }

    return (
      <div className={`${BLOCKCLASS}__icon-title main`}>
        {this.icon}
        {this.title}
      </div>
    );
  }

  render() {
    if (this.isSquare) {
      return (
        <div className={`${BLOCKCLASS}__wrapper_square `}>
          <img
            className={`${BLOCKCLASS}__square-image`}
            src={this.collectionAttributes.heroStyles.mediumSquare}
            alt="Project Collection"
          />
          <div>
            {this.iconTitle}
            {this.description}
          </div>
        </div>
      );
    }

    if (this.isWide) {
      return (
        <div className={`${BLOCKCLASS}__wrapper `}>
          {this.iconTitle}
          <div
            className={`${BLOCKCLASS}__hero-image-wrapper ${BLOCKCLASS}__hero-image-wrapper_wide`}
          >
            <img
              className={`${BLOCKCLASS}__hero-image`}
              src={this.collectionAttributes.heroStyles.mediumLandscape}
              alt="Project Collection"
            />
          </div>
          <div className={`${BLOCKCLASS}_description__right`}>
            {this.description}
          </div>
        </div>
      );
    }

    if (this.isFull) {
      return (
        <div className={`${BLOCKCLASS}__wrapper_full`}>
          <div
            className={`${BLOCKCLASS}__hero-image-wrapper ${BLOCKCLASS}__hero-image-wrapper_full`}
          >
            <img
              className={`${BLOCKCLASS}__hero-image`}
              src={this.collectionAttributes.heroStyles.largeLandscape}
              alt="Project Collection"
            />
          </div>
          <div>
            {this.iconTitle}
            <div className={`${BLOCKCLASS}_description__right`}>
              {this.description}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${BLOCKCLASS}__wrapper `}>
        {this.iconTitle}
        <div className={`${BLOCKCLASS}_description__right`}>
          {this.description}
        </div>
      </div>
    );
  }
}
