import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { settingsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
const { request } = entityStoreActions;

class SettingsPressLogoContainer extends PureComponent {

  static displayName = "Settings.PressLogo";
  static activeNavItem = "press_logo";

  static mapStateToProps(state) {
    return {
      settings: entityUtils.select(requests.settings, state.entityStore)
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.settings}
          name="backend-settings-press-logo"
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
          <Form.Save
            text="Save Settings"
          />
        </FormContainer.Form>
      </section>
    );
  }

}

export default connect(
  SettingsPressLogoContainer.mapStateToProps
)(SettingsPressLogoContainer);

