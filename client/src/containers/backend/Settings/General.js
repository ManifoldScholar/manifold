import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, MaskedTextInput } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { settingsAPI, requests } from 'api';
import { entityUtils } from 'utils';

class SettingsGeneralContainer extends PureComponent {

  static propTypes = {
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
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
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
            label="Social Sharing Messge"
            name="attributes[general][socialShareMessage]"
            instructions="Enter the text you would like to appear when a page is shared"
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

