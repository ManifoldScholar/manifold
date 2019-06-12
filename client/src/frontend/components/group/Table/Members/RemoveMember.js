import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class RemoveMemberButton extends React.PureComponent {
  static propTypes = {
  };

  get buttonClassNames() {
    return "remove-member-button";
  }

  removeMember = event => {
    event.preventDefault();
    console.log("Remove member");
  };

  render() {
    return (
      <button className={this.buttonClassNames} onClick={this.removeMember}>
        Remove
      </button>
    )
  }
}
