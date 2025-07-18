import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import withPluginReplacement from "hoc/withPluginReplacement";
import Utility from "global/components/utility";
import * as Styled from "./styles";
import withSettings from "hoc/withSettings";

function PoweredBy({
  type = "library",
  dull = false,
  withVersion,
  settings,
  t,
  children
}) {
  const isReaderFooter = type === "reader";
  const isStandaloneFooter = type === "standalone";
  const isLibraryFooter = type === "library";

  const manifoldLinkProps = {
    href: "https://manifoldapp.org",
    target: "_blank",
    rel: "noopener noreferrer"
  };

  const docsLinkProps = {
    href: "https://manifoldscholar.github.io/manifold-docusaurus/docs",
    target: "_blank",
    rel: "noopener noreferrer"
  };

  const directoryLinkProps = {
    href: "https://manifoldapp.org/directory",
    target: "_blank",
    rel: "noopener noreferrer"
  };

  const version = withVersion
    ? settings?.attributes?.calculated?.manifoldVersion?.version
    : null;

  const readerInner = (
    <>
      <Utility.IconComposer icon="manifoldLogo32" size="default" />
      <Styled.Copyright>
        {children}
        <Styled.LogoText as="div" $tiny>
          <Trans
            i18nKey="powered_by.reader_text"
            components={{
              mlink: <a {...manifoldLinkProps}>#</a>,
              docslink: <a {...docsLinkProps}>#</a>,
              dirlink: <a {...directoryLinkProps}>#</a>,
              srtext: <span className="screen-reader-text" />
            }}
          />
        </Styled.LogoText>
      </Styled.Copyright>
    </>
  );

  return (
    <Styled.Wrapper $reader={isReaderFooter}>
      <section>
        <div className="container flush">
          <Styled.LogoWrapper $reader={isReaderFooter} $dull={dull}>
            {isReaderFooter && readerInner}
            {isStandaloneFooter || isLibraryFooter ? (
              <>
                <span>
                  <Utility.IconComposer icon="manifoldLogo32" size="default" />
                  <Trans
                    i18nKey={"powered_by.frontend_text"}
                    components={{
                      neutral: <Styled.LogoText $neutral />,
                      mlink: (
                        <Styled.LogoText $white as="a" {...manifoldLinkProps} />
                      ),
                      version: <Styled.LogoText $white $hidden={!version} />,
                      srtext: <span className="screen-reader-text" />
                    }}
                    values={{ number: version }}
                  />
                </span>
                <Styled.AddtlLinks>
                  <Styled.LogoText $dull $tiny as="a" {...directoryLinkProps}>
                    <span className="screen-reader-text">
                      {t("external_links.opens_in_new")}
                    </span>
                    {t("app.manifold_directory")}
                  </Styled.LogoText>
                  <Styled.LogoText $dull $tiny as="a" {...docsLinkProps}>
                    <span className="screen-reader-text">
                      {t("external_links.opens_in_new")}
                    </span>
                    {t("app.manifold_docs")}
                  </Styled.LogoText>
                </Styled.AddtlLinks>
              </>
            ) : null}
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
  dull: PropTypes.bool,
  withVersion: PropTypes.bool,
  t: PropTypes.func
};

export default withSettings(
  withPluginReplacement(
    withTranslation()(PoweredBy, "Global.Components.Footers.PoweredBy")
  )
);
