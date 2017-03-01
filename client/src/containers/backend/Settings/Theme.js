import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { settingsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
const { request } = entityStoreActions;

class SettingsThemeContainer extends PureComponent {

  static displayName = "Settings.Theme";
  static activeNavItem = "theme";

  static mapStateToProps(state) {
    return {
      settings: entityUtils.select(requests.settings, state.entityStore)
    };
  }

  render() {
    if (!this.props.settings) return null;
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.settings}
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
          className="form-secondary"
        >
          <Form.Upload
            style="logo"
            label="Press Logo"
            current={this.props.settings.attributes.pressLogoUrl}
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

