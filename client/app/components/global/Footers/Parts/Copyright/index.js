import React, { PureComponent } from "react";
import * as Styled from "./styles";

export default class Copyright extends PureComponent {
  static displayName = "Global.Footers.Parts.Copyright";

  static defaultProps = {
    type: "library"
  };

  get isStandalone() {
    return this.props.type === "standalone";
  }

  get settings() {
    return this.props.settings;
  }

  renderCopyright() {
    if (!this.settings) return null;
    if (!this.settings.attributes.copyrightFormatted) return null;

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this.settings.attributes.copyrightFormatted
        }}
      />
    );
  }

  render() {
    const copyright = this.renderCopyright();
    if (!copyright) return null;

    return (
      <Styled.Section
        $withTopMargin={this.props.withTopMargin}
        $standalone={this.isStandalone}
      >
        <div>{this.renderCopyright()}</div>
      </Styled.Section>
    );
  }
}
