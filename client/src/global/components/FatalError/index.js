import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import BodyClass from "hoc/body-class";
import ApiTrace from "./ApiTrace";
import ClientTrace from "./ClientTrace";
import config from "config";
import IconComposer from "global/components/utility/IconComposer";
import { fatalErrorActions, notificationActions } from "actions";
import has from "lodash/has";
import lh from "helpers/linkHandler";
import { Redirect } from "react-router-dom";

export default class FatalError extends PureComponent {
  static propTypes = {
    fatalError: PropTypes.shape({
      error: PropTypes.object,
      type: PropTypes.string
    }).isRequired,
    headerLineOne: PropTypes.string.isRequired,
    headerLineTwo: PropTypes.string.isRequired,
    dismiss: PropTypes.func,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    headerLineOne: "We're at a bit of a loose end.",
    headerLineTwo: "Frightfully sorry."
  };

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
    return has(this.error, "project.id");
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

  renderProjectAuthorizationRedirect() {
    const url = lh.link("frontendProjectDetail", this.error.project.slug);
    if (this.props.dispatch) {
      this.props.dispatch(
        notificationActions.addNotification({
          id: "projectAuthorizationError",
          level: 1,
          heading:
            config.app.locale.notifications.projectAuthorizationWarning.heading
        })
      );
    }

    return (
      <Redirect
        to={{
          pathname: url,
          state: { projectAuthorizationError: this.error }
        }}
      />
    );
  }

  render() {
    if (!this.props.fatalError) return null;
    if (this.isProjectAuthorizationError)
      return this.renderProjectAuthorizationRedirect();
    const { error } = this.props.fatalError;
    const showDetail = config.environment.isDevelopment;

    return (
      <BodyClass className="browse fatal-error-page">
        <section className="fatal-error">
          <div className="error-wrapper">
            <div className="container">
              <header>
                <IconComposer
                  icon="stopSign64"
                  size={60}
                  iconClass="fatal-error__stop-icon"
                />
                <h3>
                  {this.props.headerLineOne}
                  {this.props.headerLineTwo ? (
                    <span>
                      <br />
                      {this.props.headerLineTwo}
                    </span>
                  ) : null}
                </h3>
              </header>

              <div
                className="error-description"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                {error ? (
                  <h1>
                    {error.status} Error: {error.heading}
                  </h1>
                ) : null}
                {showDetail ? (
                  <p>
                    {error.body}
                    {this.props.dismiss ? (
                      <span>
                        <br />
                        <button
                          role="link"
                          onClick={this.props.dismiss}
                          className="dismiss"
                        >
                          Try again.
                        </button>
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </div>
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
          </div>
        </section>
      </BodyClass>
    );
  }
}
