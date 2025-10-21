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

  formatData = data => {
    const { attributes, relationships } = data ?? {};
    const {
      sortOrder,
      variantThumbnail,
      variantThumbnailAltText,
      ...rest
    } = attributes;

    /* eslint-disable no-nested-ternary */
    const thumbnail =
      typeof variantThumbnailAltText === "string"
        ? {
            variantThumbnail: {
              ...variantThumbnail,
              altText: variantThumbnailAltText
            }
          }
        : variantThumbnail
        ? { variantThumbnail }
        : {};

    return {
      relationships,
      attributes: { ...rest, ...thumbnail, sortOrder: sortOrder ? 1 : null }
    };
  };

  render() {
    const { resource, t } = this.props;
    const { attributes } = resource ?? {};
    const sortOrderBool = !!attributes?.sortOrder;

    return (
      <section>
        <FormContainer.Form
          model={{
            ...resource,
            attributes: { ...resource.attributes, sortOrder: sortOrderBool }
          }}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={model =>
            resourcesAPI.create(this.props.params.projectId, model)
          }
          onSuccess={this.handleSuccess}
          formatData={this.formatData}
          className="form-secondary"
        >
          <Form.FieldGroup label={t("projects.forms.properties.header")}>
            <Resource.Form.KindPicker name="attributes[kind]" includeButtons />
            <Form.TextInput
              label={t("resources.title_label")}
              name="attributes[title]"
              placeholder={t("resources.title_placeholder")}
              instructions={t("resources.properties.title_instructions")}
              wide
            />
            <Form.TextInput
              label={t("resources.properties.sort_title_label")}
              name="attributes[pendingSortTitle]"
              placeholder={t("resources.properties.sort_title_placeholder")}
              instructions={t("resources.properties.sort_title_instructions")}
              wide
            />
            <Form.TextInput
              label={t("resources.properties.slug_label")}
              name="attributes[pendingSlug]"
              placeholder={t("resources.properties.slug_placeholder")}
              wide
            />
            <Form.TextArea
              label={t("resources.descript_label")}
              name="attributes[description]"
              placeholder={t("resources.descript_placeholder")}
              wide
            />
            <Form.TextArea
              label={t("resources.properties.caption_label")}
              name="attributes[caption]"
              placeholder={t("resources.properties.caption_placeholder")}
              wide
            />
            <Form.TextInput
              label={t("resources.properties.fingerprint_label")}
              name="attributes[fingerprint]"
              placeholder={t("resources.properties.fingerprint_placeholder")}
              instructions={t("resources.properties.fingerprint_instructions")}
              wide
            />
            <Resource.Form.KindAttributes wide />
            {resource.attributes.downloadableKind ? (
              <Form.Switch
                label={t("resources.properties.download_label")}
                name="attributes[allowDownload]"
                wide
              />
            ) : null}
          </Form.FieldGroup>
          <Form.FieldGroup label={t("resources.properties.thumbnail")}>
            <Form.Upload
              layout="square"
              label={t("resources.properties.thumbnail")}
              accepts="images"
              readFrom="attributes[variantThumbnailStyles][small]"
              name="attributes[variantThumbnail]"
              remove="attributes[removeVariantThumbnail]"
              altTextName={"attributes[variantThumbnailAltText]"}
              altTextLabel={t("resources.properties.thumbnail_alt_label")}
            />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("projects.forms.properties.taxonomy_header")}
          >
            <Form.Picker
              label={t("resources.properties.tags_label")}
              listStyle="well"
              listRowComponent="StringRow"
              name="attributes[tagList]"
              placeholder={t("resources.properties.tags_placeholder")}
              options={tagsAPI.index}
              optionToLabel={tag => tag.attributes.name}
              optionToValue={tag => tag.attributes.name}
              allowNew
            />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("projects.forms.properties.presentation_header")}
          >
            <Form.Switch
              label={t("resources.properties.sort_order_label")}
              name="attributes[sortOrder]"
              value={sortOrderBool}
              placeholder={t("resources.properties.sort_order_placeholder")}
              instructions={t("resources.properties.sort_order_instructions")}
            />
          </Form.FieldGroup>
          <Form.Save text={t("resources.properties.save")} />
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
