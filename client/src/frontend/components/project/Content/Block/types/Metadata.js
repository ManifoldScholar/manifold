import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";

export default class ProjectContentBlockMetadataBlock extends PureComponent {
  static displayName = "Project.Content.Block.Metadata";

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: "Metadata",
    icon: "tag"
  }


  get block() {
    return this.props.block;
  }

  render() {
    return (
      <Wrapper>
        <Heading title={this.props.title} icon={this.props.icon} />
        <div>Metadata Block [{this.block.id}]</div>
      </Wrapper>
    );
  }
}
