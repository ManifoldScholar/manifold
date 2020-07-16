import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

const SQUARE = "square_inset";
const WIDE = "wide_inset";
const FULL = "full_bleed";

export default class ProjectCollectionDetailHeader extends PureComponent {
  static displayName = "ProjectCollectionDetailHeader";

  get iconFill() {
    if (this.props.icon === "new-round") {
      return "var(--accent-primary, #52e3ac)";
    }

    return "currentColor";
  }

  get title() {
    return <h2 className="title">{this.props.title}</h2>;
  }

  get description() {
    return <p>{this.props.description}</p>;
  }

  get icon() {
    if (this.props.iconStyles) {
      return <img src={this.props.iconStyles.square} />;
    }

    return <IconComputed.ProjectCollection icon={this.props.icon} size={56} fill={this.iconFill} />;
  }

  get isIcon() {
    return !!(this.props.iconStyles || this.props.icon);
  }

  get isSquare() {
    return !!(this.props.heroStyles && this.props.heroLayout === SQUARE);
  }

  get isWide() {
    return !!(this.props.heroStyles && this.props.heroLayout === WIDE);
  }

  get isFull() {
    return !!(this.props.heroStyles && this.props.heroLayout === FULL);
  }

  render() {
    if (this.isSquare) {
      return (
        <>
          <div><img src={this.props.heroStyles.mediumSquare} /></div>
          <div>
            <div>
              {this.icon}
              {this.title}
            </div>
            {this.description}
          </div>
        </>
      );
    }

    if (this.isWide) {
      return (
        <>
          {this.title}
          <img src={this.props.heroStyles.mediumLandscape} />
          {this.description}
        </>
      );
    }

    if (this.isFull) {
      return (
        <>
          <img src={this.props.heroStyles.largeLandscape} />
          <div>
            {this.icon}
            {this.title}
          </div>
          {this.description}
        </>
      );
    }

    return (
      <>
        <div>
          {this.icon}
          {this.title}
        </div>
        {this.description}
      </>
    );
  }
}
