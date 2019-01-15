import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Default from "./Variants/Default";
import Image from "./Variants/Image";
import Interactive from "./Variants/Interactive";
import Pdf from "./Variants/Pdf";
import Video from "./Variants/Video";

export default class ResourceFormKindVariants extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants";

  static propTypes = {
    kind: PropTypes.string.isRequired
  };

  get component() {
    switch (this.props.kind) {
      case "image":
        return <Image {...this.props} />;
      case "interactive":
        return <Interactive {...this.props} />;
      case "pdf":
        return <Pdf {...this.props} />;
      case "video":
        return <Video {...this.props} />;
      default:
        return <Default {...this.props} />;
    }
  }

  render() {
    return this.component;
  }
}
