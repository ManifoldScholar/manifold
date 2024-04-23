import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withPluginReplacement from "hoc/withPluginReplacement";
import Utility from "global/components/utility";
import { FrontendModeContext } from "helpers/contexts";
import * as Styled from "./styles";
import withSettings from "hoc/withSettings";

class PoweredBy extends PureComponent {
  static displayName = "Global.Footers.Parts.PoweredBy";

  static contextType = FrontendModeContext;

  static propTypes = {
    dull: PropTypes.bool,
    withVersion: PropTypes.bool,
    t: PropTypes.func
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

    const version = this.props.withVersion
      ? this.props.settings?.attributes?.calculated?.manifoldVersion?.version
      : null;

    const { t } = this.props;

    return (
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
                    {t("powered_by.reader_text")}
                  </Styled.LogoText>
                  <Styled.LogoText as="a" $tiny {...this.manifoldLinkProps}>
                    <span className="screen-reader-text">
                      {t("external_links.opens_in_new")}
                    </span>
                    manifoldapp.org
                  </Styled.LogoText>
                </Styled.Copyright>
              )}
              {(this.isStandaloneFooter || this.isLibraryFooter) && (
                <Styled.LogoText>
                  <Styled.LogoText $neutral>
                    {t("powered_by.frontend_text")}
                  </Styled.LogoText>
                  <Styled.LogoText $white>{t("app.manifold")}</Styled.LogoText>
                  {version && (
                    <Styled.LogoText $white>
                      {t("powered_by.version", { number: version })}
                    </Styled.LogoText>
                  )}
                </Styled.LogoText>
              )}
            </Styled.LogoWrapper>
            {this.isStandaloneFooter && this.props.children && (
              <Styled.PostScript>{this.props.children}</Styled.PostScript>
            )}
          </div>
        </section>
      </Styled.Wrapper>
    );
  }
}

export default withSettings(
  withPluginReplacement(
    withTranslation()(PoweredBy, "Global.Components.Footers.PoweredBy")
  )
);
