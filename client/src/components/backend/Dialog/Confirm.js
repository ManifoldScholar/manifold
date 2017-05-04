import React, { PureComponent, PropTypes } from 'react';
import { Dialog } from 'components/backend';

export default class DialogWrapper extends PureComponent {

  static displayName = "Dialog.Confirm";

  static propTypes = {
    resolve: PropTypes.func.isRequired,
    reject: PropTypes.func.isRequired,
    heading: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    heading: "Are you sure?"
  }

  constructor(props) {
    super(props);
    this.handleResolveClick = this.handleResolveClick.bind(this);
    this.handleRejectClick = this.handleRejectClick.bind(this);
  }

  handleResolveClick(event) {
    event.preventDefault();
    this.props.resolve();
  }

  handleRejectClick(event) {
    event.preventDefault();
    this.props.reject();
  }

  render() {
    return (
      <Dialog.Wrapper
        className="dialog-confirm"
        maxWidth={400}
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <header className="dialog-header-small">
          <h2>{this.props.heading}</h2>
        </header>

        { this.props.message ?
          <p>
            {this.props.message}
          </p>
          : null
        }

        <div className="buttons-icon-horizontal">
          <button
            onClick={this.handleResolveClick}
            className="button-icon-secondary"
          >
            <i className="manicon manicon-check small"></i>
            Yes
          </button>
          <button
            className="button-icon-secondary dull"
            onClick={this.handleRejectClick}
          >
            <i className="manicon manicon-x small"></i>
            No
          </button>
        </div>
      </Dialog.Wrapper>
    );
  }

}
