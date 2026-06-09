import { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { withTranslation } from "react-i18next";
import { Global as GlobalStyles } from "@emotion/react";
import has from "lodash/has";
import config from "config";
import { fatalErrorActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import styles from "theme/styles/globalStyles";
import ApiTrace from "./ApiTrace";
import ClientTrace from "./ClientTrace";
import * as Styled from "./styles";

class FatalError extends PureComponent {
  static propTypes = {
    fatalError: PropTypes.shape({
      error: PropTypes.object,
      type: PropTypes.string
    }).isRequired,
    headerLineOne: PropTypes.string,
    headerLineTwo: PropTypes.string,
    dismiss: PropTypes.func,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    t: PropTypes.func,
    i18n: PropTypes.object
  };

  get defaultHeaders() {
    const t = this.props.i18n.t;
    return {
      headerLineOne: t("errors.fatal.heading_line_one"),
      headerLineTwo: t("errors.fatal.heading_line_two")
    };
  }

  get error() {
    const { error } = this.props.fatalError;
    return error;
  }

  get type() {
    const { type } = this.props.fatalError;
    return type;
  }

  get isAuthorizationError() {
    return this.error && this.type === fatalErrorActions.types.authorization;
  }

  get isProjectAuthorizationError() {
    if (!this.isAuthorizationError) return false;
    if (has(this.error, "method") && this.error.method !== "GET") return false;
    return has(this.error, "project.id");
  }

  get projectDetailUrl() {
    if (!this.isProjectAuthorizationError) return null;
    return lh.link("frontendProjectDetail", this.error.project.slug);
  }

  get shouldReturnToProjectDetail() {
    if (!this.isProjectAuthorizationError) return false;
    return this.props.location?.pathname !== this.projectDetailUrl;
  }

  // True when multiple parallel fetches 401, e.g. from a TOC link to the Reader,
  // and the first 401 has already triggered the redirect.
  get isAdditionalProjectErrorAfterReturn() {
    if (!this.isProjectAuthorizationError) return false;
    if (this.shouldReturnToProjectDetail) return false;
    return has(this.props.location, "state.projectAuthorizationError");
  }

  get handlingProjectAuthorizationError() {
    return (
      this.shouldReturnToProjectDetail ||
      this.isAdditionalProjectErrorAfterReturn
    );
  }

  get apiTrace() {
    if (!this.error || !this.error.apiTrace) return null;
    return this.error.apiTrace;
  }

  get clientTrace() {
    if (!this.error || !this.error.clientTrace) return null;
    return this.error.clientTrace;
  }

  get clientTraceTruncate() {
    if (!this.error || !this.error.clientTraceTruncate) return null;
    return this.error.clientTraceTruncate;
  }

  componentDidMount() {
    this.maybeHandleProjectAuthorizationError();
  }

  componentDidUpdate() {
    this.maybeHandleProjectAuthorizationError();
  }

  // Handle project-authorization errors imperatively so multiple 401s
  // don't trigger multiple redirects
  maybeHandleProjectAuthorizationError() {
    if (
      !this.handlingProjectAuthorizationError ||
      this.handledProjectAuthorization
    )
      return;
    this.handledProjectAuthorization = true;

    if (this.props.dispatch) {
      this.props.dispatch(
        notificationActions.addNotification({
          id: "projectAuthorizationError",
          level: 1,
          heading: this.props.t(
            "messages.project_authorization_warning.heading"
          )
        })
      );
    }

    if (this.shouldReturnToProjectDetail) {
      this.props.history.replace({
        pathname: this.projectDetailUrl,
        state: { projectAuthorizationError: this.error }
      });
    } else {
      // Redirect already happened; just clear the error
      if (!this.props.dispatch) return;
      this.props.dispatch(fatalErrorActions.clearFatalError());
    }
  }

  render() {
    if (!this.props.fatalError) return null;
    if (this.handlingProjectAuthorizationError) return null;

    const { error } = this.props.fatalError;
    const showDetail = config.environment.isDevelopment;
    const t = this.props.i18n.t;

    return (
      <HelmetProvider>
        <Helmet title={`${error.status} Error: ${error.heading}`} />
        <GlobalStyles styles={styles} />
        <Styled.Body className="browse">
          <Styled.Wrapper $minHeight={this.props.minHeight}>
            <Styled.Inner>
              <Styled.Container>
                <header>
                  <Styled.Icon icon="stopSign64" size={52} />
                  <Styled.Message>
                    {this.props.headerLineOne ??
                      this.defaultHeaders.headerLineOne}
                    {this.props.headerLineTwo !== null && (
                      <>
                        <br />
                        {this.props.headerLineTwo ??
                          this.defaultHeaders.headerLineTwo}
                      </>
                    )}
                  </Styled.Message>
                </header>
                <div role="alert" aria-live="assertive" aria-atomic="true">
                  {error ? (
                    <Styled.ErrorTitle>
                      {error.status} Error: {error.heading}
                    </Styled.ErrorTitle>
                  ) : null}
                  {showDetail ? (
                    <Styled.ErrorBody>
                      {error.body}
                      {this.props.dismiss ? (
                        <span>
                          <br />
                          <Styled.Link
                            role="link"
                            onClick={this.props.dismiss}
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
              {showDetail ? (
                <div>
                  {this.apiTrace ? <ApiTrace trace={this.apiTrace} /> : null}
                  {this.clientTrace ? (
                    <ClientTrace
                      trace={this.clientTrace}
                      truncate={this.clientTraceTruncate}
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
}

export default withRouter(withTranslation()(FatalError));
