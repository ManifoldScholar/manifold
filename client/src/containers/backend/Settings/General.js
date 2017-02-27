import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, MaskedTextInput } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { settingsAPI } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
const { requests } = entityStoreActions;

class SettingsGeneralContainer extends PureComponent {

  static propTypes = {
    handleSuccess: PropTypes.func.isRequired
  };

  static activeNavItem = "general";

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
          name="backend-settings-general"
          update={settingsAPI.update}
          create={settingsAPI.update}
          onSuccess={this.props.handleSuccess}
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="Default Publisher"
            name="attributes[general][defaultPublisher]"
            placeholder="Enter Default Publisher"
          />
          <Form.TextInput
            focusOnMount
            label="Default Place of Publication"
            name="attributes[general][defaultPlaceOfPublication]"
            placeholder="Enter Default Place of Publication"
          />
          <Form.TextInput
            focusOnMount
            label="Google Analytics Tracking ID"
            name="attributes[general][gaTrackingId]"
            placeholder="UA-000000-00"
          />
          <Form.MaskedTextInput
            focusOnMount
            label="Google Analytics Profile ID"
            name="attributes[general][gaProfileId]"
            placeholder="ga:123456789"
            mask={
              ['g', 'a', ':', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
            }
          />
          <Form.TextInput
            focusOnMount
            label="Contact Link URL"
            name="attributes[general][contactUrl]"
            placeholder="Enter a URL"
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
  SettingsGeneralContainer.mapStateToProps
)(SettingsGeneralContainer);

