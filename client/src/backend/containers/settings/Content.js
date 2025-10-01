import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import PageHeader from "backend/components/layout/PageHeader";

export class SettingsContentContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static displayName = "Settings.Content";

  static propTypes = {
    settings: PropTypes.object
  };

  render() {
    if (!this.props.settings) return null;
    const t = this.props.t;
    return (
      <div>
        <PageHeader title={t("settings.content.header")} type="settings" />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label={t("settings.content.top_bar_header")}>
              <Form.TextInput
                label={t("settings.content.text_label")}
                name="attributes[theme][topBarText]"
                placeholder={t("settings.content.text_placeholder")}
              />
              <Form.TextInput
                label={t("settings.content.color_label")}
                name="attributes[theme][topBarColor]"
                placeholder={t("settings.content.color_placeholder")}
                instructions={t("settings.content.color_instructions")}
              />
              <Form.TextInput
                label={t("settings.content.top_bar_url_label")}
                name="attributes[theme][topBarUrl]"
                placeholder={t("settings.content.top_bar_url_placeholder")}
              />
              <Form.Select
                label={t("settings.content.mode_label")}
                name="attributes[theme][topBarMode]"
                options={[
                  {
                    label: t("settings.content.mode_options.disabled"),
                    value: "disabled"
                  },
                  {
                    label: t("settings.content.mode_options.always"),
                    value: "enforced"
                  },
                  {
                    label: t("settings.content.mode_options.standalone"),
                    value: "enabled"
                  }
                ]}
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("settings.content.content_signup_header")}
            >
              <Form.TextInput
                wide
                label={t("settings.content.string_signup_terms_header")}
                name="attributes[theme][stringSignupTermsHeader]"
              />
              <Form.TextArea
                wide
                label={t("settings.content.string_signup_terms_one")}
                name="attributes[theme][stringSignupTermsOne]"
              />
              <Form.TextArea
                wide
                label={t("settings.content.string_signup_terms_two")}
                name="attributes[theme][stringSignupTermsTwo]"
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("settings.content.content_data_use_header")}
            >
              <Form.TextInput
                wide
                label={t("settings.content.string_data_use_header")}
                name="attributes[theme][stringDataUseHeader]"
              />
              <Form.TextArea
                wide
                label={t("settings.content.string_data_use_copy")}
                name="attributes[theme][stringDataUseCopy]"
                instructions={t("settings.content.data_use_copy_instructions")}
              />
              <Form.TextInput
                wide
                label={t("settings.content.string_cookies_banner_header")}
                name="attributes[theme][stringCookiesBannerHeader]"
              />
              <Form.TextArea
                wide
                label={t("settings.content.string_cookies_banner_copy")}
                name="attributes[theme][stringCookiesBannerCopy]"
                instructions={t(
                  "settings.content.cookies_banner_copy_instructions"
                )}
              />
            </Form.FieldGroup>
            <Form.Save text={t("settings.save")} />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default withTranslation()(
  connect(SettingsContentContainer.mapStateToProps)(SettingsContentContainer)
);
