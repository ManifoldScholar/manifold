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

  componentDidMount() {
    this.setDefaults();
  }

  get contentBlock() {
    return this.props.contentBlock;
  }

  get type() {
    return this.contentBlock.attributes.type;
  }

  get typeComponent() {
    return typeResolver.typeToFormComponent(this.type);
  }

  setDefaults() {
    const defaults = this.typeComponent.defaultAttributes;
    if (!defaults) return null;
    Object.keys(defaults).forEach(attr =>
      this.props.setOther(defaults[attr], `attributes[${attr}]`)
    );
  }

  render() {
    const TypeForm = this.typeComponent;

    return <TypeForm {...this.props} />;
  }
}

export default setter(ProjectContentTypeForm);
