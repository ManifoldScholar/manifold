import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";
import Filters from "./Filters";

const SQUARE = "square_inset";
const WIDE = "wide_inset";
const FULL = "full_bleed";

export default class ProjectCollectionDetailHeader extends PureComponent {
  static displayName = "ProjectCollectionDetailHeader";

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
    return <h2 className="title">{this.collectionAttributes.title}</h2>;
  }

  get description() {
    return <p>{this.collectionAttributes.descriptionFormatted}</p>;
  }

  get icon() {
    if (this.collectionAttributes.iconStyles) {
      return (
        <img
          style={{ maxWidth: "56px", maxHeight: "56px" }}
          src={this.collectionAttributes.iconStyles.square}
          alt="square"
        />
      );
    }

    return (
      <IconComputed.ProjectCollection
        icon={this.collectionAttributes.icon}
        size={56}
        fill={this.iconFill}
      />
    );
  }

  get filter() {
    return (
      <Filters
        filterChangeHandler={this.props.filterChangeHandler}
        initialState={this.props.initialState}
      />
    );
  }

  get isIcon() {
    return !!(
      this.collectionAttributes.iconStyles || this.collectionAttributes.icon
    );
  }

  get isSquare() {
    return !!(
      this.collectionAttributes.heroStyles &&
      this.collectionAttributes.heroLayout === SQUARE
    );
  }

  get isWide() {
    return !!(
      this.collectionAttributes.heroStyles &&
      this.collectionAttributes.heroLayout === WIDE
    );
  }

  get isFull() {
    return !!(
      this.collectionAttributes.heroStyles &&
      this.collectionAttributes.heroLayout === FULL
    );
  }

  render() {
    if (this.isSquare) {
      return (
        <div style={{ display: "flex" }}>
          <img
            src={this.collectionAttributes.heroStyles.mediumSquare}
            alt="Project Collection"
          />
          <div>
            <div style={{ display: "flex" }}>
              {this.icon}
              {this.title}
              {this.filter}
            </div>
            {this.description}
          </div>
        </div>
      );
    }

    if (this.isWide) {
      return (
        <>
          {this.title}
          <img
            src={this.collectionAttributes.heroStyles.mediumLandscape}
            alt="Project Collection"
          />
          {this.description}
        </>
      );
    }

    if (this.isFull) {
      return (
        <>
          <img
            src={this.collectionAttributes.heroStyles.largeLandscape}
            alt="Project Collection"
          />
          <div style={{ display: "flex" }}>
            {this.icon}
            {this.title}
          </div>
          {this.description}
        </>
      );
    }

    return (
      <>
        <div style={{ display: "flex" }}>
          {this.icon}
          {this.title}
          {this.filter}
        </div>
        {this.description}
      </>
    );
  }
}
