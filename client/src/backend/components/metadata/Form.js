import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormContainer from "backend/containers/form";
import Form from "backend/components/form";
import config from "config";
import humps from "humps";
import intersection from "lodash/intersection";
import reduce from "lodash/reduce";
import concat from "lodash/concat";
import difference from "lodash/difference";

export default class FormMakers extends PureComponent {
  static displayName = "Metadata.Form";

  static propTypes = {
    model: PropTypes.object.isRequired
  };

  get attributes() {
    return this.props.model.attributes;
  }

  get metadataProperties() {
    if (!this.attributes || !this.attributes.metadataProperties) return [];
    return this.attributes.metadataProperties.sort();
  }

  get baseStructure() {
    const keys = this.metadataProperties;
    return [
      {
        label: "Copyright",
        children: intersection(
          [
            "creator",
            "rights",
            "rightsHolder",
            "rightsTerritory",
            "restrictions",
            "credit"
          ],
          keys
        )
      },
      {
        label: "Identity",
        children: intersection(
          ["isbn", "issn", "doi", "resourcesDoi", "uniqueIdentifier"],
          keys
        )
      },
      {
        label: "Publisher",
        children: intersection(
          [
            "publisher",
            "publisherPlace",
            "originalPublisher",
            "originalPublisherPlace",
            "status"
          ],
          keys
        )
      },
      {
        label: "Bibliographic",
        children: intersection(
          [
            "containerTitle",
            "version",
            "seriesTitle",
            "seriesNumber",
            "edition",
            "issue",
            "volume",
            "originalTitle"
          ],
          keys
        )
      },
      {
        label: "Accessibility",
        children: intersection(["altText"], keys)
      }
    ];
  }

  get structure() {
    const keys = this.metadataProperties;
    const filteredStructure = this.baseStructure.filter(
      group => group.children.length > 0
    );
    const leftovers = difference(
      keys,
      reduce(
        filteredStructure,
        (used, group) => concat(used, group.children),
        []
      )
    );
    if (leftovers.length > 0) {
      filteredStructure.push({
        label: "Other",
        children: leftovers
      });
    }
    return filteredStructure;
  }

  get config() {
    return config.app.locale.metadata;
  }

  configFor(prop) {
    return this.config[prop];
  }

  labelize(prop) {
    return humps.decamelize(prop, { separator: " " });
  }

  configValueFor(prop, key) {
    const propConfig = this.configFor(prop);
    if (!propConfig || !propConfig.placeholder) return null;
    return propConfig[key];
  }

  placeholderFor(prop) {
    return this.configValueFor(prop, "placeholder");
  }

  inputPropsFor(prop) {
    return this.configValueFor(prop, "inputProps");
  }

  componentFor(prop) {
    const key = this.configValueFor(prop, "type");
    const component = Form[key];
    return component || Form.TextInput;
  }

  instructionsFor(prop) {
    return this.configValueFor(prop, "instructions");
  }

  render() {
    return (
      <section>
        <FormContainer.Form {...this.props}>
          {this.structure.map((group, gi) => {
            return (
              <Form.FieldGroup label={group.label} key={group.label}>
                {group.children.map((prop, i) => {
                  const InputComponent = this.componentFor(prop);
                  const focus = gi === 0 && i === 0;
                  return (
                    <InputComponent
                      key={prop}
                      focusOnMount={focus}
                      placeholder={this.placeholderFor(prop)}
                      instructions={this.instructionsFor(prop)}
                      label={this.labelize(prop)}
                      name={`attributes[metadata][${prop}]`}
                      {...this.inputPropsFor(prop)}
                    />
                  );
                })}
              </Form.FieldGroup>
            );
          })}
          <Form.Save text="Save Metadata" />
        </FormContainer.Form>
      </section>
    );
  }
}
