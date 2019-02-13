import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Meta from "global/components/meta";

export default class ProjectContentBlockMetadataBlock extends PureComponent {
  static displayName = "Project.Content.Block.Metadata";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  static get title() {
    return "Metadata";
  }

  static get icon() {
    return "tag";
  }

  get project() {
    return this.props.project;
  }

  render() {
    const { metadata, metadataFormatted } = this.project.attributes;

    if (!metadata || isEmpty(metadata)) return null;

    return (
      <div className="entity-section-wrapper__body entity-section-wrapper__body--pad-top">
        <Meta.List metadata={metadataFormatted} />
      </div>
    );
  }
}
