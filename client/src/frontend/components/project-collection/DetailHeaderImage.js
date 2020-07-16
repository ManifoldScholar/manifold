import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

export default class ProjectCollectionDetailHeaderImage extends PureComponent {
  static displayName = "ProjectCollectionDetailHeaderImage";

  get attributes() {
    return this.props.attributes;
  }

  render() {
    return (
      <>
        {this.attributes.iconStyles && <img src={this.attributes.iconStyles.square} />}
        {this.attributes.heroStyles && this.attributes.heroLayout === 'square_inset' && <img src={this.attributes.heroStyles.mediumSquare} />}
        {this.attributes.heroStyles && this.attributes.heroLayout === 'wide_inset' && <img src={this.attributes.heroStyles.mediumLandscape} />}
        {this.attributes.heroStyles && this.attributes.heroLayout === 'full_bleed' && <img src={this.attributes.heroStyles.largeLandscape} />}
        <IconComputed.ProjectCollection
          icon={this.attributes.icon}
          size={56}
          fill={this.iconFill}
        />
      </>
    );
  }
}
