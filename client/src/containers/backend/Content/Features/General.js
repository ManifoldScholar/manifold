import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { featuresAPI } from "api";
import connectAndFetch from "utils/connectAndFetch";

class FeaturesGeneralContainer extends PureComponent {
  static displayName = "Content.Features.General";

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
          <Form.TextInput
            validation={["required"]}
            focusOnMount
            label="Header"
            name="attributes[header]"
            placeholder="Enter the feature header"
          />
          <Form.TextInput
            label="Subheader"
            name="attributes[subheader]"
            placeholder="Optionally, enter a subheader"
          />
          <Form.Select
            label="Style"
            name="attributes[style]"
            options={[
              { label: "Dark Background", value: "dark" },
              { label: "Light Background", value: "light" }
            ]}
          />
          <Form.TextArea
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
            label="Foreground Image Position From Bottom"
            name="attributes[foregroundPosition]"
            placeholder="0"
            instructions="Enter the position of the image, in pixels, from the bottom of the feature. A negative number will move the image down."
          />
          <Form.TextInput
            label="Foreground Top Padding"
            name="attributes[foregroundTopPadding]"
            placeholder="0"
            instructions="Set the padding, in pixels, that should be applied to the top of the feature."
          />
          <Form.Save text="Save Feature" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(FeaturesGeneralContainer);
