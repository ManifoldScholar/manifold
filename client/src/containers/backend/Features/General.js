import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
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
            <Form.TextInput
              wide
              validation={["required"]}
              focusOnMount
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
            <Form.Select
              label="Style"
              name="attributes[style]"
              options={[
                { label: "", value: "" },
                { label: "Dark Background (default)", value: "dark" },
                { label: "Light Background", value: "light" }
              ]}
            />
            {/* <Form.Select */}
            {/* label="Layout" */}
            {/* name="attributes[layout]" */}
            {/* options={[ */}
            {/* { label: "Text Left, Image Right (Default)", value: "two-col-img-right" }, */}
            {/* { label: "Text Right, Image Left", value: "two-col-img-left" }, */}
            {/* { label: "One Column", value: "one-col" } */}
            {/* ]} */}
            {/* /> */}
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
              readFrom="attributes[backgroundStyles][mediumLandscape]"
              name="attributes[background]"
              remove="attributes[removeBackground]"
              instructions="The background of the feature."
            />
            <Form.Upload
              layout="portrait"
              accepts="images"
              label="Foreground Image"
              readFrom="attributes[foregroundStyles][mediumPortrait]"
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
