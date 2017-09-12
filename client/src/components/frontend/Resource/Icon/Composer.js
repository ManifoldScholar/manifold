import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Icon from "./index";

export default class ResourceIconComposer extends PureComponent {
  // Optional resource icon wrapper that can choose the correct icon based on kind
  // Insures that logic for picking a resource icon/name-mapping is only ever in one place
  static displayName = "Resource.Icon.Composer";

  static propTypes = {
    kind: PropTypes.string
  };

  constructor() {
    super();
    this.icons = {
      audio: Icon.Audio,
      collection: Icon.Collection,
      document: Icon.Document,
      file: Icon.File,
      image: Icon.Image,
      interactive: Icon.Interactive,
      link: Icon.Link,
      pdf: Icon.Pdf,
      presentation: Icon.Presentation,
      spreadsheet: Icon.Spreadsheet,
      video: Icon.Video
    };
  }

  render() {
    const ResourceIcon = this.icons[this.props.kind];

    return <ResourceIcon />;
  }
}
