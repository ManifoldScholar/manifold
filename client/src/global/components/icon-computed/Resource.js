import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";

export default class IconComputedSocial extends PureComponent {
  static displayName = "IconComputed.Resource";

  static propTypes = {
    icon: PropTypes.string.isRequired,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    size: 48
  };

  iconMap(safeKind) {
    const map = {
      document: "resourceDocument64",
      image: "resourceImage64",
      video: "resourceVideo64",
      audio: "resourceAudio64",
      file: "resourceFile64",
      link: "resourceLink64",
      pdf: "resourcePdf64",
      spreadsheet: "resourceSpreadsheet64",
      presentation: "resourcePresentation64",
      interactive: "resourceInteractive64"
    };
    return map[safeKind];
  }

  render() {
    const { icon, ...childProps } = this.props;
    return <Utility.IconComposer icon={this.iconMap(icon)} {...childProps} />;
  }
}
