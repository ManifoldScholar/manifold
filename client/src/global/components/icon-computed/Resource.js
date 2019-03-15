import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";

export default class IconComputedSocial extends PureComponent {
  static displayName = "IconComputed.Resource";

  static propTypes = {
    icon: PropTypes.string.isRequired
  };

  static defaultProps = {
    size: 48
  };

  iconMap(safeKind) {
    const map = {
      document: "ResourceDocument64",
      image: "ResourceImage64",
      video: "ResourceVideo64",
      audio: "ResourceAudio64",
      file: "ResourceFile64",
      link: "ResourceLink64",
      pdf: "ResourcePdf64",
      spreadsheet: "ResourceSpreadsheet64",
      presentation: "ResourcePresentation64",
      interactive: "ResourceInteractive64"
    };
    return map[safeKind];
  }

  render() {
    const { icon, ...childProps } = this.props;
    return <Utility.IconComposer icon={this.iconMap(icon)} {...childProps} />;
  }
}
