import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import withPluginReplacement from "hoc/withPluginReplacement";
import Utility from "global/components/utility";
import { useSettings } from "hooks";
import * as Styled from "./styles";

const MANIFOLD_LINK_PROPS = {
  href: "http://manifoldapp.org",
  target: "_blank",
  rel: "noopener noreferrer"
};

function PoweredBy({ type = "library", dull = false, withVersion, children }) {
  const { t } = useTranslation();
  const settings = useSettings();

  const isReaderFooter = type === "reader";
  const isStandaloneFooter = type === "standalone";
  const isLibraryFooter = type === "library";
  const wrapWithLink = isLibraryFooter;
  const wrapLogoWithLink = isStandaloneFooter;

  const wrapperProps = wrapWithLink ? MANIFOLD_LINK_PROPS : {};
  const logoWrapperProps = wrapLogoWithLink ? MANIFOLD_LINK_PROPS : {};

  const version = withVersion
    ? settings?.attributes?.calculated?.manifoldVersion?.version
    : null;

  return (
    <Styled.Wrapper
      as={wrapWithLink ? "a" : "div"}
      $reader={isReaderFooter}
      $library={isLibraryFooter}
      {...wrapperProps}
    >
      <section>
        <div className="container flush">
          <Styled.LogoWrapper
            as={wrapLogoWithLink ? "a" : "span"}
            $standalone={isStandaloneFooter}
            $reader={isReaderFooter}
            $dull={dull}
            {...logoWrapperProps}
          >
            <Utility.IconComposer icon="manifoldLogo32" size="default" />
            {isReaderFooter && (
              <Styled.Copyright>
                {children}
                <Styled.LogoText as="div" $tiny>
                  {t("powered_by.reader_text")}
                </Styled.LogoText>
                <Styled.LogoText as="a" $tiny {...MANIFOLD_LINK_PROPS}>
                  <span className="screen-reader-text">
                    {t("external_links.opens_in_new")}
                  </span>
                  manifoldapp.org
                </Styled.LogoText>
              </Styled.Copyright>
            )}
            {(isStandaloneFooter || isLibraryFooter) && (
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
          {isStandaloneFooter && children && (
            <Styled.PostScript>{children}</Styled.PostScript>
          )}
        </div>
      </section>
    </Styled.Wrapper>
  );
}

PoweredBy.displayName = "Global.Footers.Parts.PoweredBy";

PoweredBy.propTypes = {
  type: PropTypes.oneOf(["library", "reader", "standalone"]),
  dull: PropTypes.bool,
  withVersion: PropTypes.bool,
  children: PropTypes.node
};

export default withPluginReplacement(
  PoweredBy,
  "Global.Components.Footers.PoweredBy"
);
