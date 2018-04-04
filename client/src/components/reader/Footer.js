import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Footer extends Component {
  static propTypes = {
    text: PropTypes.object
  };

  getFooterText(text) {
    if (!text.attributes.metadataFormatted.rights) return null;
    return (
      <div
        className="rights"
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
          <div className="rel">
            <section className="colophon">
              <i className="manicon manicon-manifold-logo" />
              {this.getFooterText(this.props.text)}
              <p className="powered-by">
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
