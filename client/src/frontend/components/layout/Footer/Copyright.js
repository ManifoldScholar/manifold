import React, { PureComponent } from "react";

export default class Copyright extends PureComponent {
  static displayName = "Layout.Footer.Copyright";

  renderCopyright() {
    if (!this.props.settings) return null;
    if (!this.props.settings.attributes.copyrightFormatted) return null;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this.props.settings.attributes.copyrightFormatted
        }}
      />
    );
  }

  render() {
    return (
      <section className="footer-secondary">
        <div className="container flush">
          <div className="colophon">{this.renderCopyright()}</div>
        </div>
      </section>
    )
  }
}
