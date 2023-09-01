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

export class SettingsThemeContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static displayName = "Settings.Theme";

  static propTypes = {
    settings: PropTypes.object
  };

  render() {
    if (!this.props.settings) return null;
    const t = this.props.t;
    return (
      <div>
        <PageHeader title={t("settings.theme.header")} type="settings" />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label={t("settings.theme.branding_header")}>
              <Form.TextInput
                label={t("settings.theme.url_label")}
                name="attributes[general][pressSite]"
                placeholder={t("settings.theme.url_placeholder")}
                wide
                instructions={t("settings.theme.url_instructions")}
              />
              <Form.Upload
                accepts="images"
                label={t("settings.theme.header_logo_label")}
                readFrom="attributes[pressLogoStyles][small]"
                name="attributes[pressLogo]"
                remove="attributes[removePressLogo]"
                instructions={t("settings.theme.header_logo_instructions")}
              />
              <Form.Upload
                accepts="images"
                label={t("settings.theme.mobile_logo_label")}
                readFrom="attributes[pressLogoMobileStyles][small]"
                name="attributes[pressLogoMobile]"
                remove="attributes[removePressLogoMobile]"
                instructions={t("settings.theme.mobile_logo_instructions")}
              />
              <Form.Upload
                accepts="images"
                label={t("settings.theme.footer_logo_label")}
                readFrom="attributes[pressLogoFooterStyles][small]"
                name="attributes[pressLogoFooter]"
                remove="attributes[removePressLogoFooter]"
                instructions={t("settings.theme.footer_logo_instructions")}
              />
              <Form.Upload
                accepts="images"
                label={t("settings.theme.favicon_label")}
                readFrom="attributes[faviconStyles][original]"
                name="attributes[favicon]"
                remove="attributes[removeFavicon]"
                instructions={t("settings.theme.favicon_instructions")}
              />
              <Form.TextInput
                label={t("settings.theme.logo_styles_label")}
                name="attributes[theme][logoStyles]"
                placeholder={t("settings.theme.logo_styles_placeholder")}
                instructions={t("settings.theme.logo_styles_instructions")}
              />
              <Form.TextInput
                label={t("settings.theme.offset_label")}
                name="attributes[theme][headerOffset]"
                placeholder="0"
                instructions={t("settings.theme.offset_instructions")}
              />
              <Form.TextInput
                label={t("settings.theme.accent_color_label")}
                name="attributes[theme][accentColor]"
                placeholder="#52e3ac"
                instructions={t("settings.theme.accent_color_instructions")}
                wide
              />
              <Form.TextInput
                label={t("settings.theme.foreground_color_label")}
                name="attributes[theme][headerForegroundColor]"
                placeholder="#ffffff"
                instructions={t("settings.theme.foreground_color_instructions")}
                wide
              />
              <Form.TextInput
                label={t("settings.theme.active_foreground_color_label")}
                name="attributes[theme][headerForegroundActiveColor]"
                placeholder="#363636"
                instructions={t(
                  "settings.theme.active_foreground_color_instructions"
                )}
                wide
              />
              <Form.TextInput
                label={t("settings.theme.background_color_label")}
                name="attributes[theme][headerBackgroundColor]"
                placeholder="#696969"
                instructions={t("settings.theme.background_color_instructions")}
                wide
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={t("settings.theme.typography_header")}>
              <Form.TextInput
                label={t("settings.theme.typekit_label")}
                name="attributes[theme][typekitId]"
                placeholder={t("settings.theme.typekit_placeholder")}
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={t("settings.theme.top_bar_header")}>
              <Form.TextInput
                label={t("settings.theme.text_label")}
                name="attributes[theme][topBarText]"
                placeholder={t("settings.theme.text_placeholder")}
              />
              <Form.TextInput
                label={t("settings.theme.color_label")}
                name="attributes[theme][topBarColor]"
                placeholder={t("settings.theme.color_placeholder")}
                instructions={t("settings.theme.color_instructions")}
              />
              <Form.TextInput
                label={t("settings.theme.top_bar_url_label")}
                name="attributes[theme][topBarUrl]"
                placeholder={t("settings.theme.top_bar_url_placeholder")}
              />
              <Form.Select
                label={t("settings.theme.mode_label")}
                name="attributes[theme][topBarMode]"
                options={[
                  {
                    label: t("settings.theme.mode_options.disabled"),
                    value: "disabled"
                  },
                  {
                    label: t("settings.theme.mode_options.always"),
                    value: "enforced"
                  },
                  {
                    label: t("settings.theme.mode_options.standalone"),
                    value: "enabled"
                  }
                ]}
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={t("settings.theme.content_signup_header")}>
              <Form.TextInput
                wide
                label={t("settings.theme.string_signup_terms_header")}
                name="attributes[theme][stringSignupTermsHeader]"
              />
              <Form.TextArea
                wide
                label={t("settings.theme.string_signup_terms_one")}
                name="attributes[theme][stringSignupTermsOne]"
              />
              <Form.TextArea
                wide
                label={t("settings.theme.string_signup_terms_two")}
                name="attributes[theme][stringSignupTermsTwo]"
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("settings.theme.content_data_use_header")}
            >
              <Form.TextInput
                wide
                label={t("settings.theme.string_data_use_header")}
                name="attributes[theme][stringDataUseHeader]"
              />
              <Form.TextArea
                wide
                label={t("settings.theme.string_data_use_copy")}
                name="attributes[theme][stringDataUseCopy]"
                instructions={t("settings.theme.data_use_copy_instructions")}
              />
              <Form.TextInput
                wide
                label={t("settings.theme.string_cookies_banner_header")}
                name="attributes[theme][stringCookiesBannerHeader]"
              />
              <Form.TextArea
                wide
                label={t("settings.theme.string_cookies_banner_copy")}
                name="attributes[theme][stringCookiesBannerCopy]"
                instructions={t(
                  "settings.theme.cookies_banner_copy_instructions"
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
  connect(SettingsThemeContainer.mapStateToProps)(SettingsThemeContainer)
);
