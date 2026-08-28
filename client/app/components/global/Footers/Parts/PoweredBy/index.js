import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import Utility from "components/global/utility";
import { useSettings } from "hooks";
import * as Styled from "./styles";

const MANIFOLD_LINK_PROPS = {
  href: "https://manifoldapp.org",
  target: "_blank",
  rel: "noopener noreferrer"
};

const DOCS_LINK_PROPS = {
  href: "https://manifoldscholar.github.io/manifold-docusaurus/docs",
  target: "_blank",
  rel: "noopener noreferrer"
};

const DIRECTORY_LINK_PROPS = {
  href: "https://manifoldapp.org/directory",
  target: "_blank",
  rel: "noopener noreferrer"
};

function PoweredBy({ type = "library", dull = false, withVersion, children }) {
  const { t } = useTranslation();
  const settings = useSettings();

  const isReaderFooter = type === "reader";
  const isStandaloneFooter = type === "standalone";
  const isLibraryFooter = type === "library";

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
              mlink: <a {...MANIFOLD_LINK_PROPS}>#</a>,
              docslink: <a {...DOCS_LINK_PROPS}>#</a>,
              dirlink: <a {...DIRECTORY_LINK_PROPS}>#</a>,
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
                    i18nKey="powered_by.frontend_text"
                    components={{
                      neutral: <Styled.LogoText $neutral />,
                      mlink: (
                        <Styled.LogoText
                          $white
                          as="a"
                          {...MANIFOLD_LINK_PROPS}
                        />
                      ),
                      version: <Styled.LogoText $white $hidden={!version} />,
                      srtext: <span className="screen-reader-text" />
                    }}
                    values={{ number: version }}
                  />
                </span>
                <Styled.AddtlLinks>
                  <Styled.LogoText $dull $tiny as="a" {...DIRECTORY_LINK_PROPS}>
                    <span className="screen-reader-text">
                      {t("external_links.opens_in_new")}
                    </span>
                    {t("app.manifold_directory")}
                  </Styled.LogoText>
                  <Styled.LogoText $dull $tiny as="a" {...DOCS_LINK_PROPS}>
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
  type: PropTypes.oneOf(["library", "reader", "standalone"]),
  dull: PropTypes.bool,
  withVersion: PropTypes.bool,
  children: PropTypes.node
};

export default PoweredBy;
