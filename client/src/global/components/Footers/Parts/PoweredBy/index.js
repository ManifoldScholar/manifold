import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withPluginReplacement from "hoc/with-plugin-replacement";
import Utility from "global/components/utility";
import { FrontendModeContext } from "helpers/contexts";
import { Translation } from "react-i18next";
import * as Styled from "./styles";

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
    const wrapperProps = this.wrapWithLink ? this.manifoldLinkProps : {};
    const logoWrapperProps = this.wrapLogoWithLink
      ? this.manifoldLinkProps
      : {};

    return (
      <Translation>
        {t => (
          <Styled.Wrapper
            as={this.wrapWithLink ? "a" : "div"}
            $reader={this.isReaderFooter}
            $library={this.isLibraryFooter}
            {...wrapperProps}
          >
            <section>
              <div className="container flush">
                <Styled.LogoWrapper
                  as={this.wrapLogoWithLink ? "a" : "span"}
                  $standalone={this.isStandaloneFooter}
                  $reader={this.isReaderFooter}
                  $dull={this.dull}
                  {...logoWrapperProps}
                >
                  <Utility.IconComposer icon="manifoldLogo32" size="default" />
                  {this.isReaderFooter && (
                    <Styled.Copyright>
                      {this.props.children}
                      <Styled.LogoText as="div" $tiny>
                        {t(`powered-by-manifold-scholarship-learn-more-at`)}
                        <a {...this.manifoldLinkProps}>manifoldapp.org</a>
                      </Styled.LogoText>
                    </Styled.Copyright>
                  )}
                  {(this.isStandaloneFooter || this.isLibraryFooter) && (
                    <Styled.LogoText>
                      <Styled.LogoText $neutral>
                        {t(`powered-by`)}
                      </Styled.LogoText>{" "}
                      <Styled.LogoText $white>Manifold</Styled.LogoText>
                    </Styled.LogoText>
                  )}
                </Styled.LogoWrapper>
                {this.isStandaloneFooter && this.props.children && (
                  <Styled.PostScript>{this.props.children}</Styled.PostScript>
                )}
              </div>
            </section>
          </Styled.Wrapper>
        )}
      </Translation>
    );
  }
}

export default withPluginReplacement(
  PoweredBy,
  "Global.Components.Footers.PoweredBy"
);
