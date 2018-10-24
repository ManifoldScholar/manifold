import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import BodyClass from "components/global/HigherOrder/BodyClass";
import ApiTrace from "./ApiTrace";
import ClientTrace from "./ClientTrace";
import ComponentTrace from "./ComponentTrace";

export default class FatalError extends PureComponent {
  static propTypes = {
    fatalError: PropTypes.shape({
      error: PropTypes.object,
      type: PropTypes.string
    }).isRequired,
    headerLineOne: PropTypes.string.isRequired,
    headerLineTwo: PropTypes.string.isRequired,
    dismiss: PropTypes.func
  };

  static defaultProps = {
    headerLineOne: "We're at a bit of a loose end.",
    headerLineTwo: "Frightfully sorry."
  };

  get error() {
    const { error } = this.props.fatalError;
    return error;
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

  get componentTrace() {
    if (!this.error || !this.error.componentTrace) return null;
    return this.error.componentTrace;
  }

  render() {
    if (!this.props.fatalError) return null;
    const { error } = this.props.fatalError;
    const showDetail = process.env.NODE_ENV === "development";

    return (
      <BodyClass className="  fatal-error-page">
        <section className="fatal-error">
          <div className="error-wrapper">
            <div className="container">
              <header>
                <div className="stop-sign" aria-hidden="true">
                  <i className="manicon manicon-octagon" />
                  <i className="manicon manicon-bang" />
                </div>
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
                {this.componentTrace ? (
                  <ComponentTrace trace={this.componentTrace} />
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </BodyClass>
    );
  }
}
