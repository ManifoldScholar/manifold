import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";
import config from "../../../config";

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
            {getModelValue => (
              <>
                <Form.FieldGroup label="About">
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
                    wide
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
                </Form.FieldGroup>
                <Form.FieldGroup label="Footer">
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
                </Form.FieldGroup>
                <Form.FieldGroup label="Behaviors">
                  <Form.Switch
                    wide
                    className="form-toggle-secondary"
                    label="Restrict Access to All Projects"
                    instructions="When on, users must have entitlements to access project content"
                    name="attributes[general][restrictedAccess]"
                  />
                  {getModelValue("attributes[general][restrictedAccess]") ===
                    true && (
                    <>
                      <Form.TextInput
                        wide
                        className="form-toggle-secondary"
                        label="Restricted Access Notice Header"
                        name="attributes[general][restrictedAccessHeading]"
                        placeholder={
                          config.app.locale.notifications
                            .projectAuthorizationNotice.heading
                        }
                      />
                      <Form.TextArea
                        wide
                        className="form-toggle-secondary"
                        label="Restricted Access Notice Body"
                        name="attributes[general][restrictedAccessBody]"
                        placeholder={
                          config.app.locale.notifications
                            .projectAuthorizationNotice.body
                        }
                      />
                    </>
                  )}
                  <Form.Switch
                    className="form-toggle-secondary"
                    wide
                    label="Disable Library Views"
                    instructions="When on, this setting will disable the library views on the frontend."
                    name="attributes[general][libraryDisabled]"
                  />
                  {getModelValue("attributes[general][libraryDisabled]") ===
                    true && (
                    <>
                      <Form.Switch
                        wide
                        className="form-toggle-secondary"
                        label="Enforce Standalone Mode for All Projects"
                        name="attributes[general][allStandalone]"
                        instructions="When on, all projects will render in standalone mode."
                      />
                      <Form.TextInput
                        label="Library Page Redirect URL"
                        name="attributes[general][libraryRedirectUrl]"
                        placeholder="http://your-website.com"
                        instructions="When library views are disabled, Manifold will redirect request for non-project, non-transactional pages to this URL. If left blank, these requests will return a 404 page not found error."
                      />
                      <Form.TextInput
                        label="Home Page Redirect URL"
                        name="attributes[general][homeRedirectUrl]"
                        placeholder="http://your-website.com"
                        instructions="If set, this URL will be used instead of the Library Page Redirect URL for requests to the Manifold home page."
                      />
                    </>
                  )}
                  <Form.Switch
                    className="form-toggle-secondary"
                    wide
                    label="Disable Public Annotations and Comments"
                    instructions="When on, this setting will prevent users from commenting or annotating publicly. All reading groups will behave as private reading groups."
                    name="attributes[general][disableEngagement]"
                  />
                  <Form.Switch
                    className="form-toggle-secondary"
                    wide
                    label="Disable Reading Groups"
                    instructions="When on, this setting will prevent users from creating or joining reading groups."
                    name="attributes[general][disableReadingGroups]"
                  />
                </Form.FieldGroup>
                <Form.Save text="Save Settings" />
              </>
            )}
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connect(SettingsGeneralContainer.mapStateToProps)(
  SettingsGeneralContainer
);
