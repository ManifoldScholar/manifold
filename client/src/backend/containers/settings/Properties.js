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

export class SettingsPropertiesContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    settings: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    if (!this.props.settings) return null;
    const t = this.props.t;
    return (
      <div>
        <PageHeader title="Settings" type="settings" />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            {getModelValue => (
              <>
                <Form.FieldGroup label={t("settings.properties.about_header")}>
                  <Form.TextInput
                    focusOnMount
                    label={t("settings.properties.installation_label")}
                    name="attributes[general][installationName]"
                    placeholder="Manifold"
                    instructions={t(
                      "settings.properties.installation_instructions"
                    )}
                  />
                  <Form.TextInput
                    label={t("settings.properties.default_title_label")}
                    name="attributes[general][headTitle]"
                    placeholder={t(
                      "settings.properties.default_title_placeholder"
                    )}
                    instructions={t(
                      "settings.properties.default_title_instructions"
                    )}
                  />
                  <Form.TextArea
                    wide
                    label={t("settings.properties.default_descript_label")}
                    name="attributes[general][headDescription]"
                    placeholder={t(
                      "settings.properties.default_descript_placeholder"
                    )}
                    instructions={t(
                      "settings.properties.default_descript_instructions"
                    )}
                  />
                  <Form.TextInput
                    label={t("settings.properties.default_publisher_label")}
                    name="attributes[general][defaultPublisher]"
                    placeholder={t(
                      "settings.properties.default_publisher_placeholder"
                    )}
                  />
                  <Form.TextInput
                    label={t("settings.properties.default_pub_place_label")}
                    name="attributes[general][defaultPublisherPlace]"
                    placeholder={t(
                      "settings.properties.default_pub_place_placeholder"
                    )}
                  />
                </Form.FieldGroup>
                <Form.FieldGroup label={t("settings.properties.footer_header")}>
                  <Form.TextInput
                    label={t("settings.properties.copyright_label")}
                    name="attributes[general][copyright]"
                    placeholder={t("settings.properties.copyright_placeholder")}
                    instructions={t(
                      "settings.properties.copyright_instructions"
                    )}
                  />
                  <Form.TextInput
                    label={t("settings.properties.share_label")}
                    name="attributes[general][socialShareMessage]"
                    instructions={t("settings.properties.share_instructions")}
                  />
                  <Form.TextInput
                    label={t("settings.properties.twitter_label")}
                    name="attributes[general][twitter]"
                    placeholder={t("settings.properties.twitter_placeholder")}
                    instructions={t("settings.properties.twitter_instructions")}
                  />
                  <Form.TextInput
                    label={t("settings.properties.facebook_label")}
                    name="attributes[general][facebook]"
                    placeholder={t("settings.properties.facebook_placeholder")}
                    instructions={t(
                      "settings.properties.facebook_instructions"
                    )}
                  />
                  <Form.TextInput
                    label={t("settings.properties.email_label")}
                    name="attributes[general][contactEmail]"
                    placeholder={t("settings.properties.email_placeholder")}
                    instructions={t("settings.properties.email_instructions")}
                  />
                </Form.FieldGroup>
                <Form.FieldGroup
                  label={t("settings.properties.behaviors_header")}
                >
                  <Form.Switch
                    wide
                    label={t("settings.properties.analytics_label")}
                    instructions={t(
                      "settings.properties.analytics_instructions"
                    )}
                    name="attributes[general][disableInternalAnalytics]"
                  />
                  <Form.Switch
                    wide
                    label={t("settings.properties.access_label")}
                    instructions={t("settings.properties.access_instructions")}
                    name="attributes[general][restrictedAccess]"
                  />
                  {getModelValue("attributes[general][restrictedAccess]") ===
                    true && (
                    <>
                      <Form.TextInput
                        wide
                        label={t(
                          "settings.properties.access_notice_header_label"
                        )}
                        name="attributes[general][restrictedAccessHeading]"
                        placeholder={t(
                          "settings.properties.access_notice_header_placeholder"
                        )}
                      />
                      <Form.TextArea
                        wide
                        label={t(
                          "settings.properties.access_notice_body_label"
                        )}
                        name="attributes[general][restrictedAccessBody]"
                        placeholder={t(
                          "settings.properties.access_notice_body_placeholder"
                        )}
                      />
                    </>
                  )}
                  <Form.Switch
                    wide
                    label={t("settings.properties.library_views_label")}
                    instructions={t(
                      "settings.properties.library_views_instructions"
                    )}
                    name="attributes[general][libraryDisabled]"
                  />
                  {getModelValue("attributes[general][libraryDisabled]") ===
                    true && (
                    <>
                      <Form.Switch
                        wide
                        label={t("settings.properties.standalone_label")}
                        name="attributes[general][allStandalone]"
                        instructions={t(
                          "settings.properties.standalone_instructions"
                        )}
                      />
                      <Form.TextInput
                        label={t("settings.properties.library_redirect_label")}
                        name="attributes[general][libraryRedirectUrl]"
                        placeholder={t(
                          "settings.properties.library_redirect_placeholder"
                        )}
                        instructions={t(
                          "settings.properties.library_redirect_instructions"
                        )}
                      />
                      <Form.TextInput
                        label={t("settings.properties.home_redirect_label")}
                        name="attributes[general][homeRedirectUrl]"
                        placeholder={t(
                          "settings.properties.home_redirect_placeholder"
                        )}
                        instructions={t(
                          "settings.properties.home_redirect_instructions"
                        )}
                      />
                    </>
                  )}
                  <Form.Switch
                    wide
                    label={t("settings.properties.public_comments_label")}
                    instructions={t(
                      "settings.properties.public_comments_instructions"
                    )}
                    name="attributes[general][disableEngagement]"
                  />
                  <Form.Switch
                    wide
                    label={t("settings.properties.reading_groups_label")}
                    instructions={t(
                      "settings.properties.reading_groups_instructions"
                    )}
                    name="attributes[general][disableReadingGroups]"
                  />
                  <Form.Switch
                    wide
                    label={t("settings.properties.public_reading_groups_label")}
                    instructions={t(
                      "settings.properties.public_reading_groups_instructions"
                    )}
                    name="attributes[general][disablePublicReadingGroups]"
                  />
                  <Form.Switch
                    wide
                    label={t("settings.properties.spam_detection_label")}
                    instructions={t(
                      "settings.properties.spam_detection_instructions"
                    )}
                    name="attributes[general][disableSpamDetection]"
                  />
                  {getModelValue(
                    "attributes[general][disableSpamDetection]"
                  ) === false && (
                    <Form.TextInput
                      password
                      label={t("settings.properties.akismet_key_label")}
                      name="attributes[secrets][akismetAPIKey]"
                    />
                  )}
                </Form.FieldGroup>
                <Form.Save text={t("settings.save")} />
              </>
            )}
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default withTranslation()(
  connect(SettingsPropertiesContainer.mapStateToProps)(
    SettingsPropertiesContainer
  )
);
