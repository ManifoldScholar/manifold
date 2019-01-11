import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlockTableOfContentsBlock extends PureComponent {
  static displayName = "Project.Content.Block.TableOfContents";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block;
  }

  render() {
    return <div>Table Of Contents Block [{this.block.id}]</div>;
  }
}
