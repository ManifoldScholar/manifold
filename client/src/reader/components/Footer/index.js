import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class Footer extends Component {
  static propTypes = {
    text: PropTypes.object
  };

  getFooterText(text) {
    if (!text.attributes.metadataFormatted.rights) return null;
    return (
      <div
        className="footer-reader__rights"
        dangerouslySetInnerHTML={{
          __html: text.attributes.metadataFormatted.rights
        }}
      />
    );
  }

  render() {
    return (
      <footer className="footer-reader">
        <div className="container">
          <div className="footer-reader__inner">
            <IconComposer
              size={48}
              icon="manifoldLogo32"
              iconClass="footer-reader__logo"
            />
            <section className="footer-reader__colophon">
              {this.getFooterText(this.props.text)}
              <p className="footer-reader__powered-by">
                Powered by Manifold Scholarship. Learn more at&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://manifoldapp.org"
                >
                  manifoldapp.org
                </a>
              </p>
            </section>
          </div>
        </div>
      </footer>
    );
  }
}
