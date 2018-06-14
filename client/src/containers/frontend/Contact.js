import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import PropTypes from "prop-types";
import { contactsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { Form } from "components/global";

const { request, flush } = entityStoreActions;

export class ContactContainer extends Component {
  static propTypes = {
    history: PropTypes.object,
    dispatch: PropTypes.func,
    response: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      response: state.entityStore.responses[requests.gContactForm]
    };
  };

  constructor() {
    super();
    this.state = {
      contact: {
        email: "",
        message: "",
        fullName: ""
      }
    };
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.gContactForm));
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  sendMessage = event => {
    event.preventDefault(event.target);
    this.props
      .dispatch(
        request(
          contactsAPI.create({ attributes: this.state.contact }),
          requests.gContactForm
        )
      )
      .promise.then(() => {
        this.redirectToHome();
      });
  };

  handleInputChange = event => {
    const contact = Object.assign({}, this.state.contact, {
      [event.target.name]: event.target.value
    });
    this.setState({ contact });
  };

  render() {
    const errors = get(this.props.response, "errors") || [];

    return (
      <section>
        <div className="container">
          <form method="post" onSubmit={this.sendMessage}>
            <h4 className="form-heading">Send a Message</h4>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[email]"
                errors={errors}
                idForError="create-email-error"
              >
                <label htmlFor="create-email">Email</label>
                <input
                  value={this.state.contact.email}
                  type="text"
                  name="email"
                  id="create-email"
                  aria-describedby="create-email-error"
                  onChange={this.handleInputChange}
                  placeholder="Email"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name={"attributes[fullName]"}
                errors={errors}
                idForError="create-name-error"
              >
                <label htmlFor="create-name">Name</label>
                <input
                  value={this.state.contact.fullName}
                  type="text"
                  id="create-name"
                  aria-describedby="create-name-error"
                  name="fullName"
                  onChange={this.handleInputChange}
                  placeholder="Name"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                className="form-input"
                name="attributes[message]"
                errors={errors}
                idForError="create-message-error"
              >
                <label htmlFor="create-message">Message</label>
                <textarea
                  value={this.state.contact.message}
                  type="message"
                  name="message"
                  id="create-message"
                  onChange={this.handleInputChange}
                  placeholder="Message"
                  className="dark-placeholder wide large"
                  aria-describedby="create-message-error"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <div className="form-input-submit">
                <input
                  className="button-secondary button-with-room"
                  type="submit"
                  value="Send a Message"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default connect(ContactContainer.mapStateToProps)(ContactContainer);
