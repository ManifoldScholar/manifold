import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";
import Utility from "global/components/utility";
import classNames from "classnames";

class PostFooter extends PureComponent {
  static displayName = "Layout.Footer.PostFooter";

  get standaloneMode() {
    return this.props.standaloneMode;
  }

  get searchPosition() {
    return this.props.searchPosition;
  }

  get dull() {
    return this.searchPosition === "left";
  }

  get manifoldFooterLinkClasses() {
    return classNames({
      "manifold-footer__logo-link": true,
      "manifold-footer__logo-link--block": !this.standaloneMode,
      "manifold-footer": !this.standaloneMode
    });
  }

  render() {
    return (
      <a
        href="http://manifoldapp.org"
        target="_blank"
        rel="noopener noreferrer"
        className={this.manifoldFooterLinkClasses}
      >
        <section
          aria-hidden="true"
          className={!this.standaloneMode ? "container" : undefined}
        >
          <div className="container flush">
            <span
              className={classNames({
                "manifold-footer__logo": true,
                "manifold-footer__logo--dull": this.dull
              })}
            >
              <Utility.IconComposer
                icon="manifoldLogo32"
                size="default"
                iconClass={classNames({
                  "manifold-footer__manifold-logo-icon": true,
                  "manifold-footer__manifold-logo-icon--dull": this.dull
                })}
              />
              <span className="manifold-footer__logo-text">
                <span className="manifold-footer__logo-text--neutral">
                  Powered by
                </span>{" "}
                  <span className="manifold-footer__logo-text--white">
                  Manifold
                </span>
              </span>
            </span>
          </div>
        </section>
        <span className="screen-reader-text">
          Learn more about the Manifold App
        </span>
      </a>
    );
  }
}

export default withPluginReplacement(
  PostFooter,
  "Frontend.Components.Layout.Footer.PostFooter"
);
