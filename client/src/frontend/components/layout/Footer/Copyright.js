import React, { PureComponent } from "react";

export default class Copyright extends PureComponent {
  static displayName = "Layout.Footer.Copyright";

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
    return (
      <section className="footer-secondary">
        <div className="container flush">
          <div className="colophon">{this.renderCopyright()}</div>
        </div>
      </section>
    );
  }
}
