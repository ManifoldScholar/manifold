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
          <Form.FieldGroup label={t("backend.forms.feature.properties_label")}>
            <Form.Switch
              wide
              label={t("backend.forms.feature.published_label")}
              name="attributes[live]"
              instructions={t("backend.forms.feature.published_instructions")}
            />
            <Form.TextInput
              wide
              validation={["required"]}
              label={t("backend.forms.feature.header_label")}
              name="attributes[header]"
              placeholder={t("backend.forms.feature.header_placeholder")}
            />
            <Form.TextInput
              wide
              label={t("backend.forms.feature.subheader_label")}
              name="attributes[subheader]"
              placeholder={t("backend.forms.feature.subheader_placeholder")}
            />
            <Form.TextArea
              wide
              label={t("backend.forms.feature.body_label")}
              rows={200}
              name="attributes[body]"
              placeholder={t("backend.forms.feature.body_placeholder")}
            />
            <Form.TextInput
              label={t("backend.forms.feature.link_label")}
              name="attributes[linkText]"
              placeholder={t("backend.forms.feature.link_placeholder")}
            />
            <Form.TextInput
              label={t("backend.forms.feature.url_label")}
              name="attributes[linkUrl]"
              placeholder={t("backend.forms.feature.url_placeholder")}
            />
            <Form.Switch
              wide
              label={t("backend.forms.feature.sign_up_label")}
              name="attributes[includeSignUp]"
              instructions={t("backend.forms.feature.sign_up_instructions")}
            />
            <Form.Select
              label={t("backend.forms.feature.style_label")}
              name="attributes[style]"
              options={[
                { label: "", value: "" },
                {
                  label: t("backend.forms.feature.style_options.dark"),
                  value: "dark"
                },
                {
                  label: t("backend.forms.feature.style_options.light"),
                  value: "light"
                }
              ]}
            />
            <Form.TextInput
              label={t("backend.forms.feature.background_label")}
              name="attributes[backgroundColor]"
              placeholder="#000000"
            />
            <Form.TextInput
              label={t("backend.forms.feature.foreground_label")}
              name="attributes[foregroundColor]"
              placeholder="#000000"
            />
            <Form.TextInput
              label={t("backend.forms.feature.header_color_label")}
              name="attributes[headerColor]"
              placeholder="#000000"
            />
            <Form.Upload
              layout="landscape"
              accepts="images"
              label={t("backend.forms.feature.background_image_label")}
              readFrom="attributes[backgroundStyles][small]"
              name="attributes[background]"
              remove="attributes[removeBackground]"
              instructions={t(
                "backend.forms.feature.background_image_instructions"
              )}
            />
            <Form.Upload
              layout="portrait"
              accepts="images"
              label={t("backend.forms.feature.foreground_image_label")}
              readFrom="attributes[foregroundStyles][small]"
              name="attributes[foreground]"
              remove="attributes[removeForeground]"
              instructions={t(
                "backend.forms.feature.foreground_image_instructions"
              )}
            />
            <Form.TextInput
              label={t("backend.forms.feature.foreground_image_position.top")}
              name="attributes[foregroundTop]"
              placeholder="0em"
            />
            <Form.TextInput
              label={t("backend.forms.feature.foreground_image_position.left")}
              name="attributes[foregroundLeft]"
              placeholder="0em"
            />
            <Form.Select
              label={t(
                "backend.forms.feature.foreground_image_position.mode.label"
              )}
              name="attributes[foregroundPosition]"
              options={[
                { label: "", value: "" },
                {
                  label: t(
                    "backend.forms.feature.foreground_image_position.mode.rrelative"
                  ),
                  value: "relative"
                },
                {
                  label: t(
                    "backend.forms.feature.foreground_image_position.mode.absolute"
                  ),
                  value: "absolute"
                }
              ]}
            />
            <Form.Save text={t("backend.forms.feature.submit_label")} />
          </Form.FieldGroup>
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(FeaturesPropertiesContainer));
