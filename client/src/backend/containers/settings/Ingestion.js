import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";

import withFormSession from "hoc/with-form-session";

export class SettingsIngestionContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    form: PropTypes.object,
    settings: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <section>
        <Layout.ViewHeader>Ingestion Settings</Layout.ViewHeader>
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
              label="Global Ingestion Styles"
              mode="css"
              name="attributes[ingestion][globalStyles]"
              instructions="Styles entered here will be applied to all Texts as they are ingested."
            />
            <Form.CodeArea
              label="Mammoth Style Map"
              name="attributes[ingestion][mammothStyleMap]"
              instructions={
                <>
                  Enter your{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.npmjs.com/package/mammoth#writing-style-maps"
                  >
                    Mammoth style map
                  </a>{" "}
                  to convert your custom Word styles to HTML attributes.
                </>
              }
            />
            <Form.Save text="Save Settings" />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </section>
    );
  }
}

export default withFormSession(
  connect(SettingsIngestionContainer.mapStateToProps)(
    SettingsIngestionContainer
  ),
  "backend-settings"
);
