import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import Resource from "backend/components/resource";
import FormContainer from "global/containers/form";
import { resourcesAPI, tagsAPI } from "api";
import { connect } from "react-redux";

export class ResourcePropertiesContainer extends PureComponent {
  static displayName = "Resource.Properties";

  static propTypes = {
    resource: PropTypes.object,
    params: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = this.initialState();
  }

  initialState() {
    return {
      newKind: null,
      changeKind: false
    };
  }

  handleSuccess = () => {
    this.setState(this.initialState);
  };

  render() {
    const resource = this.props.resource.attributes;
    const t = this.props.t;
    return (
      <section>
        <FormContainer.Form
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={model =>
            resourcesAPI.create(this.props.params.projectId, model)
          }
          onSuccess={this.handleSuccess}
          className="form-secondary"
        >
          <Resource.Form.KindPicker name="attributes[kind]" />
          <Form.TextInput
            label={t("backend_entities.resources.forms.title_label")}
            name="attributes[title]"
            placeholder={t(
              "backend_entities.resources.forms.title_placeholder"
            )}
            instructions={t(
              "backend_entities.resources.forms.properties.title_instructions"
            )}
          />
          <Form.TextInput
            label={t(
              "backend_entities.resources.forms.properties.sort_title_label"
            )}
            name="attributes[pendingSortTitle]"
            placeholder={t(
              "backend_entities.resources.forms.properties.sort_title_placeholder"
            )}
            instructions={t(
              "backend_entities.resources.forms.properties.sort_title_instructions"
            )}
            disabled
          />
          <Form.TextInput
            label={t(
              "backend_entities.resources.forms.properties.fingerprint_label"
            )}
            name="attributes[fingerprint]"
            placeholder={t(
              "backend_entities.resources.forms.properties.fingerprint_placeholder"
            )}
            instructions={t(
              "backend_entities.resources.forms.properties.fingerprint_instructions"
            )}
            disabled
          />
          <Form.TextInput
            label={t("backend_entities.resources.forms.properties.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t(
              "backend_entities.resources.forms.properties.slug_placeholder"
            )}
          />
          <Form.Picker
            label={t("backend_entities.resources.forms.properties.tags_label")}
            listStyle="well"
            listRowComponent="StringRow"
            name="attributes[tagList]"
            placeholder={t(
              "backend_entities.resources.forms.properties.tags_placeholder"
            )}
            options={tagsAPI.index}
            optionToLabel={tag => tag.attributes.name}
            optionToValue={tag => tag.attributes.name}
            allowNew
          />
          <Form.TextArea
            label={t("backend_entities.resources.forms.descript_label")}
            name="attributes[description]"
            placeholder={t(
              "backend_entities.resources.forms.descript_placeholder"
            )}
          />
          <Form.TextArea
            label={t(
              "backend_entities.resources.forms.properties.caption_label"
            )}
            name="attributes[caption]"
            placeholder={t(
              "backend_entities.resources.forms.properties.caption_placeholder"
            )}
          />
          {resource.downloadableKind ? (
            <Form.Switch
              label={t(
                "backend_entities.resources.forms.properties.download_label"
              )}
              name="attributes[allowDownload]"
            />
          ) : null}
          <Resource.Form.KindAttributes />
          <Form.Save
            text={t("backend_entities.resources.forms.properties.save")}
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(
  connect(ResourcePropertiesContainer.mapStateToProps)(
    ResourcePropertiesContainer
  )
);
