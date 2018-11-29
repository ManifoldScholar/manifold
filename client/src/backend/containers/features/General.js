import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { featuresAPI } from "api";
import connectAndFetch from "utils/connectAndFetch";

class FeaturesGeneralContainer extends PureComponent {
  static displayName = "Features.General";

  static propTypes = {
    feature: PropTypes.object,
    onSuccess: PropTypes.func,
    sessionName: PropTypes.string
  };

  render() {
    const { feature } = this.props;
    return (
      <section>
        <FormContainer.Form
          model={feature}
          onSuccess={this.props.onSuccess}
          name={this.props.sessionName}
          update={featuresAPI.update}
          create={featuresAPI.create}
          className="form-secondary"
        >
          <Form.FieldGroup label="General">
            <Form.Switch
              wide
              label="Published"
              name="attributes[live]"
              instructions="Only published features will appear on the home page."
            />
            <Form.TextInput
              wide
              validation={["required"]}
              label="Header"
              name="attributes[header]"
              placeholder="Enter the feature header"
            />
            <Form.TextInput
              wide
              label="Subheader"
              name="attributes[subheader]"
              placeholder="Optionally, enter a subheader"
            />
            <Form.TextArea
              wide
              label="Body"
              rows={200}
              name="attributes[body]"
              placeholder="A couple sentences about the feature"
            />
            <Form.TextInput
              label="Link Text"
              name="attributes[linkText]"
              placeholder="Enter Link Text"
            />
            <Form.TextInput
              label="Link URL"
              name="attributes[linkUrl]"
              placeholder="Enter Link URL"
            />
            <Form.Switch
              wide
              label="Include Sign Up Button"
              name="attributes[includeSignUp]"
              instructions="If enabled, a sign up button will be displayed over the feature for unauthenticated users."
            />
            <Form.Select
              label="Style"
              name="attributes[style]"
              options={[
                { label: "", value: "" },
                { label: "Dark Background (default)", value: "dark" },
                { label: "Light Background", value: "light" }
              ]}
            />
            <Form.TextInput
              label="Background Color"
              name="attributes[backgroundColor]"
              placeholder="#000000"
            />
            <Form.TextInput
              label="Foreground Color"
              name="attributes[foregroundColor]"
              placeholder="#000000"
            />
            <Form.TextInput
              label="Header Color"
              name="attributes[headerColor]"
              placeholder="#000000"
            />
            <Form.Upload
              layout="landscape"
              accepts="images"
              label="Background Image"
              readFrom="attributes[backgroundStyles][small]"
              name="attributes[background]"
              remove="attributes[removeBackground]"
              instructions="The background of the feature."
            />
            <Form.Upload
              layout="portrait"
              accepts="images"
              label="Foreground Image"
              readFrom="attributes[foregroundStyles][small]"
              name="attributes[foreground]"
              remove="attributes[removeForeground]"
              instructions="An image to display in the foreground"
            />
            <Form.TextInput
              label="Foreground Image Top Position"
              name="attributes[foregroundTop]"
              placeholder="0em"
            />
            <Form.TextInput
              label="Foreground Image Left Position"
              name="attributes[foregroundLeft]"
              placeholder="0em"
            />
            <Form.Select
              label="Foreground Position Mode"
              name="attributes[foregroundPosition]"
              options={[
                { label: "", value: "" },
                { label: "Relative (default)", value: "relative" },
                { label: "Absolute", value: "absolute" }
              ]}
            />
            <Form.Save text="Save Feature" />
          </Form.FieldGroup>
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(FeaturesGeneralContainer);
