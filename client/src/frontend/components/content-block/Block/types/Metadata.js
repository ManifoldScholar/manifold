import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";
import Meta from "global/components/meta";

export default class ProjectContentBlockMetadataBlock extends PureComponent {
  static displayName = "Project.Content.Block.Metadata";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  get title() {
    return "Metadata";
  }

  get icon() {
    return "tag";
  }

  get project() {
    return this.props.project;
  }

  render() {
    const { metadata, metadataFormatted } = this.project.attributes;

    if (!metadata || isEmpty(metadata)) return null;

    const baseClass = "entity-section-wrapper";

    return (
      <Wrapper>
        <Heading title={this.title} icon={this.icon} />
        <div className={`${baseClass}__body ${baseClass}__body--pad-top`}>
          <Meta.List metadata={metadataFormatted} />
        </div>
      </Wrapper>
    );
  }
}
