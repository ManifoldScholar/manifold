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
    if (this.isNew) this.setDefaults();
  }

  get contentBlock() {
    return this.props.contentBlock;
  }

  get isNew() {
    return this.contentBlock.id === "pending";
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
    const { typeComponent: TypeForm } = this;

    return <TypeForm {...this.props} />;
  }
}

export default setter(ProjectContentTypeForm);
