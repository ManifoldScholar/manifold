import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import PageHeader from "backend/components/layout/PageHeader";

import withFormSession from "hoc/withFormSession";

export class SettingsIngestionContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    form: PropTypes.object,
    settings: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  render() {
    if (!this.props.settings) return null;
    const t = this.props.t;
    return (
      <section>
        <PageHeader title={t("settings.ingestion.header")} type="settings" />
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.CodeArea
              focusOnMount
              label={t("settings.ingestion.global_styles_label")}
              mode="css"
              name="attributes[ingestion][globalStyles]"
              instructions={t("settings.ingestion.global_styles_instructions")}
            />
            <Form.CodeArea
              label={t("settings.ingestion.mammoth_style_label")}
              name="attributes[ingestion][mammothStyleMap]"
              instructions={
                <Trans
                  i18nKey="settings.ingestion.mammoth_style_instructions"
                  components={[
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.npmjs.com/package/mammoth#writing-style-maps"
                    >
                      #
                    </a>
                  ]}
                />
              }
            />
            <Form.Save text={t("settings.save")} />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </section>
    );
  }
}

export default withFormSession(
  withTranslation()(
    connect(SettingsIngestionContainer.mapStateToProps)(
      SettingsIngestionContainer
    )
  ),
  "backend-settings"
);
