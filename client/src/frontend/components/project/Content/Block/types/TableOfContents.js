import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";

export default class ProjectContentBlockTableOfContentsBlock extends PureComponent {
  static displayName = "Project.Content.Block.TableOfContents";

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: "Table of Contents",
    icon: "bulletList"
  }

  get block() {
    return this.props.block;
  }

  render() {
    return (
      <Wrapper>
        <Heading title={this.props.title} icon={this.props.icon} />
        <div>Table Of Contents Block [{this.block.id}]</div>
      </Wrapper>
    );
  }
}
