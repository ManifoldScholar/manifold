import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class SearchMenuButton extends PureComponent {
  static propTypes = {
    toggleSearchMenu: PropTypes.func,
    active: PropTypes.bool
  };

  clickHandler = event => {
    event.stopPropagation();
    this.props.toggleSearchMenu();
  };

  render() {
    const buttonClass = classNames({
      "button-search": true,
      "button-active": this.props.active
    });
    return (
      <button
        className={buttonClass}
        onClick={this.clickHandler}
        data-id="toggle-menu"
      >
        <Utility.IconComposer
          className="search-icon"
          icon="search16"
          size={22}
        />
        <span className="screen-reader-text">Open search</span>
      </button>
    );
  }
}
