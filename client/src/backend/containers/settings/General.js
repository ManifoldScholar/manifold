import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";

export class SettingsGeneralContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    settings: PropTypes.object
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <div>
        <Layout.ViewHeader>General Settings</Layout.ViewHeader>
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.TextInput
              focusOnMount
              label="How do you refer to your Manifold installation?"
              name="attributes[general][installationName]"
              placeholder="Manifold"
              instructions={
                'There are various places throughout the application where \
              Manifold refers to itself. If you set a value here, Manifold will use it where \
              appropriate. For example, you could call it "Manifold at the University of \
              Minnesota Press" or just "University of Minnesota Digital Books." Or, if you\
              prefer, you can leave this blank, and Manifold will just refer to itself as \
              "Manifold."'
              }
            />
            <Form.TextInput
              label="Default Page Title"
              name="attributes[general][headTitle]"
              placeholder="Enter page title"
              instructions="This field will be used as the page title on the home page, and will be appended to the page title on core Manifold pages. Defaults to 'Manifold Scholarship'."
            />
            <Form.TextArea
              label="Default Page Description"
              name="attributes[general][headDescription]"
              placeholder="Enter page description"
              instructions="This field will be used as the page description on the home page. Defaults to 'Transforming scholarly publications into living digital works'."
            />
            <Form.TextInput
              label="Default Publisher"
              name="attributes[general][defaultPublisher]"
              placeholder="Enter Default Publisher"
            />
            <Form.TextInput
              label="Default Place of Publication"
              name="attributes[general][defaultPublisherPlace]"
              placeholder="Enter Default Place of Publication"
            />
            <Form.TextInput
              label="Copyright"
              name="attributes[general][copyright]"
              placeholder="Enter Copyright Information"
              instructions="Enter the installation copyright information to be displayed in the footer."
            />
            <Form.TextInput
              label="Social Sharing Message"
              name="attributes[general][socialShareMessage]"
              instructions="Enter the text you would like to appear when a page is shared."
            />
            <Form.TextInput
              label="Twitter Account"
              name="attributes[general][twitter]"
              placeholder="Enter Twitter account"
              instructions="Enter the twitter account associated with this installation."
            />
            <Form.TextInput
              label="Facebook Page ID"
              name="attributes[general][facebook]"
              placeholder="Enter Facebook ID"
              instructions="Enter an ID for this installation/organization's Facebook page."
            />
            <Form.TextInput
              label="Contact Email"
              name="attributes[general][contactEmail]"
              placeholder="Enter an email address"
              instructions="If present, the footer will contain a link to a contact form that will be delivered to this address."
            />
            <Form.Save text="Save Settings" />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connect(SettingsGeneralContainer.mapStateToProps)(
  SettingsGeneralContainer
);