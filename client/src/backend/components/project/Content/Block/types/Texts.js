import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ProjectContentBlocksTexts extends PureComponent {
  static displayName = "Project.Content.Block.Types.Texts";

  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Texts",
    icon: "bookStackIsometric"
  };

  static isAvailable(currentBlocksIgnored) {
    return true;
  }

  render() {
    return this.props.children(this.props);
  }
}
