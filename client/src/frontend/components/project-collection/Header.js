import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import IconComputed from "global/components/icon-computed";
import Constants from "./Constants";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";

export default class ProjectCollectionHeader extends PureComponent {
  static displayName = "ProjectCollection.Header";

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

  get hasCustomIcon() {
    return has(this.collectionAttributes.customIconStyles, "smallSquare");
  }

  get hasStockIcon() {
    return Boolean(this.collectionAttributes.icon);
  }

  get icon() {
    if (this.hasCustomIcon) return this.customIcon;
    if (this.hasStockIcon) return this.stockIcon;
    return null;
  }

  get isIcon() {
    return !!(
      this.collectionAttributes.customIconStyles ||
      this.collectionAttributes.icon
    );
  }

  get isSquareHero() {
    if (!this.hasHeroImage) return false;
    return this.heroLayout === Constants.SQUARE;
  }

  get isWideHero() {
    if (!this.hasHeroImage) return false;
    return this.heroLayout === Constants.WIDE;
  }

  get isFullHero() {
    if (!this.hasHeroImage) return false;
    return this.heroLayout === Constants.FULL;
  }

  get hasHeroImage() {
    const { heroStyles } = this.collectionAttributes;
    return heroStyles && !isEmpty(heroStyles);
  }

  get heroLayout() {
    return this.collectionAttributes.heroLayout;
  }

  get heroImageUrl() {
    if (!this.hasHeroImage) return null;
    if (this.isSquareHero)
      return this.collectionAttributes.heroStyles.mediumSquare;
    if (this.isWideHero)
      return this.collectionAttributes.heroStyles.largeLandscape;
    if (this.isFullHero)
      return this.collectionAttributes.heroStyles.largeLandscape;
  }

  get stockIcon() {
    return (
      <div className="project-collection-header__icon">
        <IconComputed.ProjectCollection
          icon={this.collectionAttributes.icon}
          size={60}
          fill={this.iconFill}
        />
      </div>
    );
  }

  get title() {
    return (
      <h2 className="project-collection-header__title">
        {this.collectionAttributes.title}
      </h2>
    );
  }

  get customIcon() {
    return (
      <img
        className="project-collection-header__icon"
        src={this.collectionAttributes.customIconStyles.smallSquare}
        alt=""
      />
    );
  }

  get heroImage() {
    if (!this.hasHeroImage) return null;
    return (
      <img
        className={classNames({
          "project-collection-header__hero": true,
          "project-collection-header__hero--square": this.isSquareHero,
          "project-collection-header__hero--wide": this.isWideHero,
          "project-collection-header__hero--full": this.isFullHero
        })}
        src={this.heroImageUrl}
        alt=""
      />
    );
  }

  get header() {
    const header = (
      <div className="project-collection-header__header">
        {this.icon}
        {this.title}
      </div>
    );
    if (!this.props.hasLink) return header;
    return (
      <Link
        className="project-collection-header__header--link"
        to={lh.link(
          "frontendProjectCollection",
          this.collectionAttributes.slug
        )}
      >
        {header}
      </Link>
    );
  }

  get description() {
    if (!this.collectionAttributes.descriptionFormatted) return null;
    return (
      <p
        className="project-collection-header__description"
        dangerouslySetInnerHTML={{
          __html: this.collectionAttributes.descriptionFormatted
        }}
      />
    );
  }

  render() {
    return (
      <div
        className={classNames({
          "project-collection-header": true,
          "project-collection-header--square": this.isSquareHero,
          "project-collection-header--wide": this.isWideHero,
          "project-collection-header--full": this.isFullHero,
          "project-collection-header--no-description": !this.description
        })}
      >
        {this.heroImage}
        {this.header}
        {this.description}
      </div>
    );
  }
}
