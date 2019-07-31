import React from "react";
import PropTypes from "prop-types";

export default class RemoveMemberButton extends React.PureComponent {
  static propTypes = {};

  get buttonClassNames() {
    return "remove-member-button";
  }

  removeMember = event => {
    event.preventDefault();
  };

  render() {
    return (
      <button className={this.buttonClassNames} onClick={this.removeMember}>
        Remove
      </button>
    );
  }
}
