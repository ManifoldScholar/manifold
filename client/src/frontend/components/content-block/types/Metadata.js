import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Meta from "global/components/meta";

export default class ProjectContentBlockMetadataBlock extends PureComponent {
  static displayName = "Project.Content.Block.Metadata";

  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static get title() {
    return "Metadata";
  }

  static get icon() {
    return "metadata64";
  }

  get entity() {
    return this.props.entity;
  }

  render() {
    const { metadata, metadataFormatted } = this.entity.attributes;

    if (!metadata || isEmpty(metadata)) return null;

    return <Meta.List metadata={metadataFormatted} />;
  }
}
