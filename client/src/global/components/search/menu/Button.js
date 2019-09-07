import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class SearchMenuButton extends PureComponent {
  static propTypes = {
    toggleSearchMenu: PropTypes.func,
    active: PropTypes.bool,
    className: PropTypes.string
  };

  clickHandler = event => {
    event.stopPropagation();
    this.props.toggleSearchMenu();
  };

  render() {
    const buttonClass = classNames(this.props.className, {
      "button-search": true,
      "button-active": this.props.active
    });
    return (
      <button
        className={buttonClass}
        onClick={this.clickHandler}
        data-id="toggle-menu"
        aria-haspopup
        aria-expanded={this.props.active}
      >
        <Utility.IconComposer
          iconClass="search-icon"
          icon="search24"
          size={32}
        />
        <span className="screen-reader-text">{"Search"}</span>
      </button>
    );
  }
}
