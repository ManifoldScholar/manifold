import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";

export class SettingsThemeContainer extends PureComponent {
  static displayName = "Settings.Theme";

  static propTypes = {
    settings: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <section>
        <FormContainer.Form
          model={this.props.settings}
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
          className="form-secondary"
        >
          <Form.Upload
            layout="square"
            accepts="images"
            label="Press Logo"
            readFrom="attributes[pressLogoStyles][smallSquare]"
            name="attributes[pressLogo]"
            remove="attributes[removePressLogo]"
          />
          <Form.TextInput
            focusOnMount
            label="Typekit ID"
            name="attributes[theme][typekitId]"
            placeholder="Enter Typekit ID"
          />
          <Form.Save text="Save Settings" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(SettingsThemeContainer.mapStateToProps)(
  SettingsThemeContainer
);
