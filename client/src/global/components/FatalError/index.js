import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Global as GlobalStyles } from "@emotion/react";
import config from "config";
import styles from "theme/styles/globalStyles";
import ApiTrace from "./ApiTrace";
import ClientTrace from "./ClientTrace";
import * as Styled from "./styles";

export default function FatalError(props) {
  const {
    fatalError: { error },
    headerLineOne,
    headerLineTwo,
    dismiss,
    contained = false,
    hideStatus = false,
    userMessage
  } = props;

  const { t } = useTranslation();

  const defaultHeaders = {
    headerLineOne: t("errors.fatal.heading_line_one"),
    headerLineTwo: t("errors.fatal.heading_line_two")
  };

  return (
    <HelmetProvider>
      <Helmet title={`${error.status} Error: ${error.heading}`} />
      {!contained && <GlobalStyles styles={styles} />}
      <Styled.Body className={!contained ? "browse" : undefined}>
        <Styled.Wrapper $contained={contained}>
          <Styled.Inner>
            <Styled.Container>
              <header>
                <Styled.Icon icon="stopSign64" size={52} />
                <Styled.Message>
                  {headerLineOne
                    ? t(headerLineOne)
                    : defaultHeaders.headerLineOne}
                  {headerLineTwo !== null && (
                    <>
                      <br />
                      {headerLineTwo ?? defaultHeaders.headerLineTwo}
                    </>
                  )}
                </Styled.Message>
              </header>
              <div role="alert" aria-live="assertive" aria-atomic="true">
                {error && !hideStatus ? (
                  <Styled.ErrorTitle>
                    {error.status} Error: {error.heading}
                  </Styled.ErrorTitle>
                ) : null}
                {userMessage ? (
                  <Styled.ErrorBody>{t(userMessage)}</Styled.ErrorBody>
                ) : null}
                {config.environment.isDevelopment && (dismiss || error.body) ? (
                  <Styled.ErrorBody>
                    API Error Body (dev only): {error.body}
                    {dismiss ? (
                      <span>
                        <br />
                        <Styled.Link
                          role="link"
                          onClick={dismiss}
                          className="dismiss"
                        >
                          {t("errors.fatal.dismiss_link")}
                        </Styled.Link>
                      </span>
                    ) : null}
                  </Styled.ErrorBody>
                ) : null}
              </div>
            </Styled.Container>
            {config.environment.isDevelopment ? (
              <div>
                {error.apiTrace ? <ApiTrace trace={error.apiTrace} /> : null}
                {error.clientTrace ? (
                  <ClientTrace
                    trace={error.clientTrace}
                    truncate={error.clientTraceTruncate}
                  />
                ) : null}
              </div>
            ) : null}
          </Styled.Inner>
        </Styled.Wrapper>
      </Styled.Body>
    </HelmetProvider>
  );
}

FatalError.propTypes = {
  fatalError: PropTypes.shape({
    error: PropTypes.object,
    type: PropTypes.string
  }).isRequired,
  headerLineOne: PropTypes.string,
  headerLineTwo: PropTypes.string,
  dismiss: PropTypes.func,
  hideStatus: PropTypes.bool,
  contained: PropTypes.bool,
  userMessage: PropTypes.string
};
