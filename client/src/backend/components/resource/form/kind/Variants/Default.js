import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindVariantsDefault extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants.Default";

  static propTypes = {
    kind: PropTypes.string
  };

  render() {
    return (
      <>
        <Form.Upload
          layout="square"
          label="Variant #1"
          accepts={this.props.kind}
          readFrom="attributes[variantFormatOneFileName]"
          name="attributes[variantFormatOne]"
          remove="attributes[removeVariantFormatOne]"
          {...this.props}
        />
        <Form.Upload
          layout="square"
          label="Variant #2"
          accepts={this.props.kind}
          readFrom="attributes[variantFormatTwoFileName]"
          name="attributes[variantFormatTwo]"
          remove="attributes[removeVariantFormatTwo]"
          {...this.props}
        />
      </>
    );
  }
}
