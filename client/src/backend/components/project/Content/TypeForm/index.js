import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import typeResolver from "../helpers/resolver";

export default class ProjectContentTypeForm extends PureComponent {
  static displayName = "Project.Content.TypeForm";

  static propTypes = {
    contentBlock: PropTypes.object
  };

  get contentBlock() {
    return this.props.contentBlock;
  }

  get type() {
    return this.contentBlock.attributes.type;
  }

  get typeComponent() {
    return typeResolver.typeToFormComponent(this.type);
  }

  render() {
    const TypeForm = this.typeComponent;

    return <TypeForm {...this.props} />;
  }
}
