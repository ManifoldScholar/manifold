import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withPluginReplacement from "hoc/with-plugin-replacement";
import Utility from "global/components/utility";
import classNames from "classnames";
import { FrontendModeContext } from "helpers/contexts";
import { Translation } from 'react-i18next';

class PoweredBy extends PureComponent {
  static displayName = "Global.Footers.Parts.PoweredBy";

  static contextType = FrontendModeContext;

  static propTypes = {
    dull: PropTypes.bool
  };

  static defaultProps = {
    type: "library",
    dull: false
  };

  get dull() {
    return this.props.dull;
  }

  get isReaderFooter() {
    return this.props.type === "reader";
  }

  get isStandaloneFooter() {
    return this.props.type === "standalone";
  }

  get isLibraryFooter() {
    return this.props.type === "library";
  }

  get manifoldLinkProps() {
    return {
      href: "http://manifoldapp.org",
      target: "_blank",
      rel: "noopener noreferrer"
    };
  }

  get wrapWithLink() {
    return this.isLibraryFooter;
  }

  get wrapLogoWithLink() {
    return this.isStandaloneFooter;
  }

  render() {
    const Wrapper = this.wrapWithLink ? "a" : "div";
    const wrapperProps = this.wrapWithLink ? this.manifoldLinkProps : {};
    const LogoWrapper = this.wrapLogoWithLink ? "a" : "span";
    const logoWrapperProps = this.wrapLogoWithLink
      ? this.manifoldLinkProps
      : {};

    return (
      <Translation>
        {t => (
          <Wrapper
            {...wrapperProps}
            className={classNames({
              "app-footer-powered-by": true,
              "app-footer-powered-by--with-hover": this.isLibraryFooter,
              "app-footer-powered-by--standalone": this.isStandaloneFooter,
              "app-footer-powered-by--reader": this.isReaderFooter
            })}
          >
            <section>
              <div className="container flush">
                <LogoWrapper
                  {...logoWrapperProps}
                  className={classNames({
                    "app-footer-powered-by__logo": true,
                    "app-footer-powered-by__logo--with-hover": this
                      .isStandaloneFooter,
                    "app-footer-powered-by__logo--dull": this.dull,
                    "app-footer-powered-by__logo--w-copyright": this.isReaderFooter
                  })}
                >
                  <Utility.IconComposer
                    icon="manifoldLogo32"
                    size="default"
                    className={classNames({
                      "app-footer-powered-by__logo-icon": true,
                      "app-footer-powered-by__logo-icon--dull": this.dull
                    })}
                  />
                  {this.isReaderFooter && (
                    <div className="app-footer-powered-by__copyright">
                      {this.props.children}
                      <div className="app-footer-powered-by__logo-text app-footer-powered-by__logo-text--tiny">
                        {t(`powered-by-manifold-scholarship-learn-more-at`)}
                        <a {...this.manifoldLinkProps}>manifoldapp.org</a>
                      </div>
                    </div>
                  )}
                  {this.isStandaloneFooter && (
                    <span className="app-footer-powered-by__logo-text">
                      <span className="app-footer-powered-by__logo-text--neutral">
                        {t(`powered-by`)}
                      </span>{" "}
                      <span className="app-footer-powered-by__logo-text--white">
                        Manifold
                      </span>
                    </span>
                  )}
                  {this.isLibraryFooter && (
                    <span className="app-footer-powered-by__logo-text">
                      <span className="app-footer-powered-by__logo-text--neutral">
                        {t(`powered-by`)}
                      </span>{" "}
                      <span className="app-footer-powered-by__logo-text--white">
                        Manifold
                      </span>
                    </span>
                  )}
                </LogoWrapper>
                {this.isStandaloneFooter && this.props.children && (
                  <div className={"app-footer-powered-by__postscript"}>
                    {this.props.children}
                  </div>
                )}
              </div>
            </section>
          </Wrapper>
        )}
      </Translation>
    );
  }
}

export default withPluginReplacement(
  PoweredBy,
  "Global.Components.Footers.PoweredBy"
);
