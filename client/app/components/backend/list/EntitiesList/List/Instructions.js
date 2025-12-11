import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListEntitiesListInstructions extends PureComponent {
  static displayName = "List.Entities.List.Instructions";

  static propTypes = {
    instructions: PropTypes.node.isRequired,
    id: PropTypes.string
  };

  get instructions() {
    return this.props.instructions;
  }

  get id() {
    return this.props.id;
  }

  render() {
    return (
      <div className="instructional-copy" id={this.id}>
        {this.instructions}
      </div>
    );
  }
}
