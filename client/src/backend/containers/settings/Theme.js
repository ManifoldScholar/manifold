import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";

export class SettingsThemeContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  static displayName = "Settings.Theme";

  static propTypes = {
    settings: PropTypes.object
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <div>
        <Layout.ViewHeader>Theme Settings</Layout.ViewHeader>
        <Layout.BackendPanel>
          <FormContainer.Form
            model={this.props.settings}
            name="backend-settings"
            update={settingsAPI.update}
            create={settingsAPI.update}
            className="form-secondary"
          >
            <Form.FieldGroup label={"Branding"}>
              <Form.TextInput
                label="Press Website URL"
                name="attributes[general][pressSite]"
                placeholder="Enter URL"
                wide
                instructions="If present, the footer press logo image will link to this URL."
              />
              <Form.Upload
                accepts="images"
                label="Header Logo"
                readFrom="attributes[pressLogoStyles][small]"
                name="attributes[pressLogo]"
                remove="attributes[removePressLogo]"
                instructions="The header logo appears in the top left of the frontend header. The logo will be resized to a max height of 60px."
              />
              <Form.Upload
                accepts="images"
                label="Mobile Header Logo"
                readFrom="attributes[pressLogoMobileStyles][small]"
                name="attributes[pressLogoMobile]"
                remove="attributes[removePressLogoMobile]"
                instructions="This header logo will be used on mobile devices. We strongly recommend using a square logo here."
              />
              <Form.Upload
                accepts="images"
                label="Press Footer Logo"
                readFrom="attributes[pressLogoFooterStyles][small]"
                name="attributes[pressLogoFooter]"
                remove="attributes[removePressLogoFooter]"
                instructions="The footer logo appears in the footer. The logo dimensions will be capped at 325px width and 200px height."
              />
              <Form.Upload
                accepts="images"
                label="Favicon"
                readFrom="attributes[faviconStyles][original]"
                name="attributes[favicon]"
                remove="attributes[removeFavicon]"
                instructions="The favicon will appear in the browser tab next to the page title.  The favicon will be cropped to a square, thus we strongly recommend using a square image here."
              />
              <Form.TextInput
                label="Logo Styles"
                name="attributes[theme][logoStyles]"
                placeholder="Additional Logo CSS"
                instructions={`Enter a JSON style object, which will be applied to the logo image. For example: {"left": -1}`}
              />
              <Form.TextInput
                label="Header Navigation Offset"
                name="attributes[theme][headerOffset]"
                placeholder="0"
                instructions={`Use this field to adjust the vertical position of header navigation. For example, enter "5" to move the header down 5 pixels. Enter "-5" to move it up 5 pixels.`}
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={"Typography"}>
              <Form.TextInput
                label="Typekit ID"
                name="attributes[theme][typekitId]"
                placeholder="Enter Typekit ID"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={"Press Header Bar"}>
              <Form.TextInput
                label="Text"
                name="attributes[theme][topBarText]"
                placeholder="Enter Press Bar Text"
              />
              <Form.TextInput
                label="Color"
                name="attributes[theme][topBarColor]"
                placeholder="Enter Press Bar Color"
                instructions="Enter a hex code beginning with #"
              />
              <Form.TextInput
                label="URL"
                name="attributes[theme][topBarUrl]"
                placeholder="Enter Press Bar Link URL"
              />
              <Form.Select
                label="Press Bar Display Mode"
                name="attributes[theme][topBarMode]"
                options={[
                  { label: "Disabled", value: "disabled" },
                  { label: "Always Visible", value: "enforced" },
                  { label: "Only Visible in Standalone Mode", value: "enabled" }
                ]}
              />
            </Form.FieldGroup>
            <Form.Save text="Save Settings" />
          </FormContainer.Form>
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connect(SettingsThemeContainer.mapStateToProps)(
  SettingsThemeContainer
);
