import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../Wrapper";
import { UIDConsumer } from "react-uid";
import Body from "./ConfirmModalBody";

export default class DialogConfirm extends PureComponent {
  static displayName = "Dialog.Confirm";

  static propTypes = {
    resolve: PropTypes.func,
    reject: PropTypes.func.isRequired,
    heading: PropTypes.string,
    options: PropTypes.object,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static contextTypes = {
    pauseKeyboardEvents: PropTypes.func,
    unpauseKeyboardEvents: PropTypes.func
  };

  componentDidMount() {
    if (this.context.pauseKeyboardEvents) this.context.pauseKeyboardEvents();
  }

  componentWillUnmount() {
    if (this.context.unpauseKeyboardEvents)
      this.context.unpauseKeyboardEvents();
  }

  render() {
    return (
      <UIDConsumer name={id => `dialog-${id}`}>
        {id => (
          <Wrapper
            className="dialog-confirm"
            maxWidth={400}
            showCloseButton={false}
            closeOnOverlayClick={false}
            labelledBy={`${id}-label`}
            describedBy={`${id}-description`}
            onEsc={this.props.reject}
          >
            <Body
              heading={this.props.heading}
              message={this.props.message}
              id={id}
              resolve={this.props.resolve}
              reject={this.props.reject}
              options={this.props.options}
            />
          </Wrapper>
        )}
      </UIDConsumer>
    );
  }
}
