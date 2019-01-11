import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import typeResolver from "../helpers/resolver";
import setter from "backend/components/form/setter";

export class ProjectContentTypeForm extends PureComponent {
  static displayName = "Project.Content.TypeForm";

  static propTypes = {
    contentBlock: PropTypes.object,
    project: PropTypes.object
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

export default setter(ProjectContentTypeForm);
