import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { websocketActions } from "actions";
import get from "lodash/get";

export class DeveloperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      messages: get(state.websocket.channels, "IngestionChannel.messages")
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    messages: PropTypes.array
  };

  connect = event => {
    event.preventDefault();
    const channel = "IngestionChannel";
    const options = {};
    this.props.dispatch(websocketActions.subscribe(channel, options));
  };

  disconnect = event => {
    event.preventDefault();
    const channel = "IngestionChannel";
    const options = {};
    this.props.dispatch(websocketActions.unsubscribe(channel, options));
  };

  messages() {
    if (!this.props.messages) return null;
    return this.props.messages.map(msg => {
      return <div key={msg}>{JSON.stringify(msg)}</div>;
    });
  }

  render() {
    return (
      <div>
        <section>
          <div className="container">
            <div style={{ marginBottom: 15 }}>
              <button
                onClick={this.connect}
                className="button-secondary outlined"
              >
                Start websocket connection
              </button>
            </div>
            <div style={{ marginBottom: 15 }}>
              <button
                onClick={this.disconnect}
                className="button-secondary outlined"
              >
                Close websocket connection
              </button>
            </div>
            <div style={{ border: "1px solid red" }}>{this.messages()}</div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(DeveloperContainer);
