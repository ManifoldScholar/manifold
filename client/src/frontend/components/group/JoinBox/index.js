import React, { Component } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";

export default class JoinBox extends Component {
  get containerClassNames() {
    return "group-join-box";
  }

  get joinTextHeadingClassNames() {
    return "group-join-box__heading-text";
  }

  get joinTextInstructionsClassNames() {
    return "group-join-box__instructions";
  }

  get formClassNames() {
    return "group-join-box__form";
  }

  get inputClassNames() {
    return "group-join-box__input";
  }

  get buttonClassNames() {
    return "group-join-box__button";
  }

  get joinTextHeading() {
    return "Join a group: ";
  }

  get joinTextInstructions() {
    return "To join a group, enter the code and select Join.";
  }

  get inputPlaceholder() {
    return "Enter Code";
  }

  get idPrefix() {
    return "join-box";
  }

  handleJoinButton = event => {
    event.stopPropagation();
  };

  render() {
    return (
      <div className={this.containerClassNames}>
        <div>
          <span className={this.joinTextHeadingClassNames}>
            {this.joinTextHeading}
          </span>
          <span className={this.joinTextInstructionsClassNames}>
            {this.joinTextInstructions}
          </span>
        </div>
        <form className={this.formClassNames}>
          <UID name={id => `${this.idPrefix}-${id}`}>
            {id => (
              <label htmlFor={id}>
                <span className="screen-reader-text">Code to join</span>
                <input
                  id={id}
                  placeholder={this.inputPlaceholder}
                  className={this.inputClassNames}
                />
              </label>
            )}
          </UID>
          <button
            onClick={event => {
              this.handleJoinButton(event);
            }}
            className={this.buttonClassNames}
          >
            Join
          </button>
        </form>
      </div>
    );
  }
}
