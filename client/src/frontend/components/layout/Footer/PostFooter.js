import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";
import Utility from "global/components/utility";
import classNames from "classnames";

class PostFooter extends PureComponent {
  static displayName = "Layout.Footer.PostFooter";

  render() {
    return (
      <a
        href="http://manifoldapp.org"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-tertiary"
      >
        <section aria-hidden="true">
          <div className="container flush">
            <span
              className={
                this.props.searchPosition === "left" ? "logo dull" : "logo"
              }
            >
              <Utility.IconComposer
                icon="manifoldLogo32"
                size="default"
                iconClass={classNames("footer-tertiary__manifold-logo", {
                  "footer-tertiary__manifold-logo--dull": this.props
                    .searchPosition
                })}
              />
              <span className="text">
                <span className="neutral-text">Powered by</span>
                <span className="white-text"> Manifold</span>
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
