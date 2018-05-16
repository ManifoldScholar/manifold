import React, { Component } from "react";
import PropTypes from "prop-types";
import { Developer } from "components/global";

export default class FatalError extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired
  };

  render() {
    const error = this.props.error;
    let statusMessage = "";
    if (error.status) statusMessage = `${error.status} error.`;

    const detail = error.detail;
    const title = error.title || error.error;

    return (
      <section
        className="error-page"
        ref={fillHeight => {
          this.fillHeight = fillHeight;
        }}
      >
        <div className="error-wrapper">
          <div className="container">
            <header>
              <div className="stop-sign" aria-hidden="true">
                <i className="manicon manicon-octagon" />
                <i className="manicon manicon-bang" />
              </div>
              <h3>
                {"We're at a bit of a loose end."}
                <br />
                {"Frightfully sorry."}
              </h3>
            </header>

            <div className="error-description">
              <h1>
                {statusMessage} {title}
              </h1>
              {process.env.NODE_ENV === "development" && error.exception ? (
                <h1>{error.exception}</h1>
              ) : null}
              {detail ? <p>{detail}</p> : null}
            </div>
          </div>
          {error.traces && process.env.NODE_ENV === "development" ? (
            <div
              style={{
                textAlign: "left",
                marginTop: 25,
                paddingBottom: "1vh",
                backgroundColor: "rgb(248,248,248)",
                position: "relative",
                marginBottom: "-10vh"
              }}
            >
              <Developer.Debugger
                label="Traces"
                theme="light"
                shouldExpandNode={(keyNameIgnored, dataIgnored, levelIgnored) =>
                  true
                }
                object={{
                  ApplicationTrace: error.traces["Application Trace"]
                }}
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }
}
