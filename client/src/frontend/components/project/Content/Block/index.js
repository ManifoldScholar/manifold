import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import typeResolver from "../helpers/resolver";

export default class ProjectContentBlock extends PureComponent {
  static displayName = "Project.Content.Blocks.Block";

  static propTypes = {
    project: PropTypes.object,
    block: PropTypes.object.isRequired
  };

  get block() {
    return this.props.block
  }

  get type() {
    return this.block.attributes.type;
  }

  get typeComponent() {
    return typeResolver.typeToBlockComponent(this.type);
  }

  render() {
    const TypeComponent = this.typeComponent;

    return <TypeComponent {...this.props} />
  }
}
