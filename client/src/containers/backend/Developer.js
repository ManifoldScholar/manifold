import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { websocketActions } from 'actions';
import get from 'lodash/get';

class DeveloperContainer extends PureComponent {

  static mapStateToProps(state) {
    console.log(state, 'state');
    return {
      messages: get(state.websocket.channels, "IngestionChannel.messages")
    };
  }

  constructor(props) {
    super(props);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  connect(event) {
    event.preventDefault();
    const channel = "IngestionChannel";
    const options = {};
    this.props.dispatch(websocketActions.connect(channel, options));
  }

  disconnect(event) {
    event.preventDefault();
    const channel = "IngestionChannel";
    const options = {};
    this.props.dispatch(websocketActions.disconnect(channel, options));
  }

  messages() {
    if (!this.props.messages) return null;
    return this.props.messages.map((msg, index) => {
      return (
        <div key={index}>{JSON.stringify(msg)}</div>
      );
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
            <div style={{ border: "1px solid red" }} >
              {this.messages()}
            </div>
          </div>
        </section>
      </div>
    );

  }

}

const Developer = connect(
  DeveloperContainer.mapStateToProps
)(DeveloperContainer);

export default Developer;
