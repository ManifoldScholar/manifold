import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { settingsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
const { request } = entityStoreActions;

class SettingsThemeContainer extends PureComponent {

  static displayName = "Settings.Theme";

  static mapStateToProps(state) {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  }

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
            style="square"
            accepts="images"
            label="Press Logo"
            readFrom="attributes[pressLogoUrl][smallSquare]"
            name="attributes[press_logo]"
            remove="attributes[removePressLogo]"
          />
          <Form.TextInput
            focusOnMount
            label="Typekit ID"
            name="attributes[theme][typekitId]"
            placeholder="Enter Typekit ID"
          />
          <Form.Save
            text="Save Settings"
          />
        </FormContainer.Form>
      </section>
    );
  }

}

export default connect(
  SettingsThemeContainer.mapStateToProps
)(SettingsThemeContainer);

