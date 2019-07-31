import React, { PureComponent } from "react";
import classNames from "classnames";

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
    const containerClasses = classNames("app-footer__copyright", {
      "app-footer__copyright": true,
      "app-footer__copyright--with-top-margin": this.props.withTopMargin,
      "app-footer__copyright--standalone": this.isStandalone
    });

    return (
      <section className={containerClasses}>
        <div
          className={classNames({
            container: !this.isStandalone,
            flush: !this.isStandalone
          })}
        >
          <div className="app-footer__colophone">{this.renderCopyright()}</div>
        </div>
      </section>
    );
  }
}
