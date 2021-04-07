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
                label="Website URL"
                name="attributes[general][pressSite]"
                placeholder="Enter URL"
                wide
                instructions="If present, the footer logo will link to this URL."
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
                label="Footer Logo"
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
              <Form.TextInput
                label="Accent Color"
                name="attributes[theme][accentColor]"
                placeholder="#52e3ac"
                instructions="Enter a color in one of the following formats: CSS color keyword, hexadecimal, rgb, rgba, hsl, hsla, or hwb. Leave blank to restore default accent color."
                wide
              />
              <Form.TextInput
                label="Header Foreground Color"
                name="attributes[theme][headerForegroundColor]"
                placeholder="#ffffff"
                instructions="Override the header foreground color in one of the allowed formats (see above)."
                wide
              />
              <Form.TextInput
                label="Header Foreground Active Color"
                name="attributes[theme][headerForegroundActiveColor]"
                placeholder="#363636"
                instructions={`Override the header foreground active state color in one of the allowed formats (see above). A link in the primary navigation is "active" when the user is currently on that page.`}
                wide
              />
              <Form.TextInput
                label="Header Background Color"
                name="attributes[theme][headerBackgroundColor]"
                placeholder="#696969"
                instructions="Override the header background color in one of the allowed formats (see above)."
                wide
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={"Typography"}>
              <Form.TextInput
                label="Typekit ID"
                name="attributes[theme][typekitId]"
                placeholder="Enter Typekit ID"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label={"Top Bar"}>
              <Form.TextInput
                label="Text"
                name="attributes[theme][topBarText]"
                placeholder="Enter Top Bar Text"
              />
              <Form.TextInput
                label="Color"
                name="attributes[theme][topBarColor]"
                placeholder="Enter Top Bar Color"
                instructions="Enter a color in one of the following formats: CSS color keyword, hexadecimal, rgb, rgba, hsl, hsla, or hwb. Leave blank to restore default accent color."
              />
              <Form.TextInput
                label="URL"
                name="attributes[theme][topBarUrl]"
                placeholder="Enter Top Bar Link URL"
              />
              <Form.Select
                label="Top Bar Display Mode"
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
