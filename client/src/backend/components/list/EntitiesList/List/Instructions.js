import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListEntitiesListInstructions extends PureComponent {
  static displayName = "List.Entities.List.Instructions";

  static propTypes = {
    instructions: PropTypes.node.isRequired
  };

  get instructions() {
    return this.props.instructions;
  }

  render() {
    return <div className="instructional-copy">{this.instructions}</div>;
  }
}
