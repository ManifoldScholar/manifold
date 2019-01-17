import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksHero extends PureComponent {
  static displayName = "Project.Content.Block.Types.Hero";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Hero",
    icon: "booksOnShelf"
  };

  static top = true;

  static isAvailable(currentBlocks) {
    return (
      currentBlocks.findIndex(block => {
        return block.attributes.type === "Content::HeroBlock";
      }) === -1
    );
  }

  render() {
    return this.props.children(this.props);
  }
}
