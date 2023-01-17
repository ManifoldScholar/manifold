import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import typeResolver from "../helpers/resolver";
import setter from "global/components/form/setter";
import Form from "../../../../global/components/form";
import { withTranslation } from "react-i18next";

export class ProjectContentTypeForm extends PureComponent {
  static displayName = "Project.Content.TypeForm";

  static propTypes = {
    contentBlock: PropTypes.object,
    project: PropTypes.object,
    t: PropTypes.func
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
    const TypeForm = this.typeComponent;

    return (
      <>
        <Form.Select
          label="Access"
          options={[
            {
              label: this.props.t("layout.visibility_options.always"),
              value: "always"
            },
            {
              label: this.props.t("layout.visibility_options.authorized"),
              value: "authorized"
            },
            {
              label: this.props.t("layout.visibility_options.unauthorized"),
              value: "unauthorized"
            }
          ]}
          name="attributes[access]"
        />
        <TypeForm {...this.props} />
      </>
    );
  }
}

export default withTranslation()(setter(ProjectContentTypeForm));
