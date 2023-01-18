import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { featuresAPI } from "api";
import connectAndFetch from "utils/connectAndFetch";

class FeaturesPropertiesContainer extends PureComponent {
  static displayName = "Features.Properties";

  static propTypes = {
    feature: PropTypes.object,
    onSuccess: PropTypes.func,
    sessionName: PropTypes.string,
    t: PropTypes.func
  };

  render() {
    const { feature, t } = this.props;
    return (
      <section>
        <FormContainer.Form
          model={feature}
          onSuccess={this.props.onSuccess}
          name={this.props.sessionName}
          update={featuresAPI.update}
          create={featuresAPI.create}
          className="form-secondary"
        >
          <Form.FieldGroup label={t("records.features.properties_label")}>
            <Form.Switch
              wide
              label={t("records.features.published_label")}
              name="attributes[live]"
              instructions={t("records.features.published_instructions")}
              isPrimary
            />
            <Form.TextInput
              wide
              validation={["required"]}
              label={t("records.features.header_label")}
              name="attributes[header]"
              placeholder={t("records.features.header_placeholder")}
            />
            <Form.TextInput
              wide
              label={t("records.features.subheader_label")}
              name="attributes[subheader]"
              placeholder={t("records.features.subheader_placeholder")}
            />
            <Form.TextArea
              wide
              label={t("records.features.body_label")}
              rows={200}
              name="attributes[body]"
              placeholder={t("records.features.body_placeholder")}
            />
            <Form.TextInput
              label={t("records.features.link_label")}
              name="attributes[linkText]"
              placeholder={t("records.features.link_placeholder")}
            />
            <Form.TextInput
              label={t("records.features.url_label")}
              name="attributes[linkUrl]"
              placeholder={t("records.features.url_placeholder")}
            />
            <Form.Switch
              wide
              label={t("records.features.sign_up_label")}
              name="attributes[includeSignUp]"
              instructions={t("records.features.sign_up_instructions")}
              isPrimary
            />
            <Form.Select
              label={t("records.features.style_label")}
              name="attributes[style]"
              options={[
                { label: "", value: "" },
                {
                  label: t("records.features.style_options.dark"),
                  value: "dark"
                },
                {
                  label: t("records.features.style_options.light"),
                  value: "light"
                }
              ]}
            />
            <Form.TextInput
              label={t("records.features.background_label")}
              name="attributes[backgroundColor]"
              placeholder="#000000"
            />
            <Form.TextInput
              label={t("records.features.foreground_label")}
              name="attributes[foregroundColor]"
              placeholder="#000000"
            />
            <Form.TextInput
              label={t("records.features.header_color_label")}
              name="attributes[headerColor]"
              placeholder="#000000"
            />
            <Form.Upload
              layout="landscape"
              accepts="images"
              label={t("records.features.background_image_label")}
              readFrom="attributes[backgroundStyles][small]"
              name="attributes[background]"
              remove="attributes[removeBackground]"
              instructions={t("records.features.background_image_instructions")}
            />
            <Form.Upload
              layout="portrait"
              accepts="images"
              label={t("records.features.foreground_image_label")}
              readFrom="attributes[foregroundStyles][small]"
              name="attributes[foreground]"
              remove="attributes[removeForeground]"
              instructions={t("records.features.foreground_image_instructions")}
            />
            <Form.TextInput
              label={t("records.features.foreground_image_position.top")}
              name="attributes[foregroundTop]"
              placeholder="0em"
            />
            <Form.TextInput
              label={t("records.features.foreground_image_position.left")}
              name="attributes[foregroundLeft]"
              placeholder="0em"
            />
            <Form.Select
              label={t("records.features.foreground_image_position.mode.label")}
              name="attributes[foregroundPosition]"
              options={[
                { label: "", value: "" },
                {
                  label: t(
                    "records.features.foreground_image_position.mode.relative"
                  ),
                  value: "relative"
                },
                {
                  label: t(
                    "records.features.foreground_image_position.mode.absolute"
                  ),
                  value: "absolute"
                }
              ]}
            />
            <Form.Save text={t("records.features.submit_label")} />
          </Form.FieldGroup>
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(FeaturesPropertiesContainer));
