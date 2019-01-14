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

  static isAvailable(currentBlocksIgnored) {
    return false;
  }

  render() {
    return this.props.children(this.props);
  }
}
