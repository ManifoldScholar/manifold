import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import Utility from "global/components/utility";

class SearchMenuButton extends PureComponent {
  static propTypes = {
    toggleSearchMenu: PropTypes.func,
    active: PropTypes.bool,
    className: PropTypes.string,
    iconSize: PropTypes.oneOf([22, 32]),
    t: PropTypes.func
  };

  get iconSize() {
    return this.props.iconSize || 22;
  }

  get icon() {
    return this.iconSize === 32 ? "search24" : "search16";
  }

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
        aria-haspopup="dialog"
        aria-expanded={this.props.active}
      >
        <Utility.IconComposer
          className="search-icon"
          icon={this.icon}
          size={this.iconSize}
        />
        <span className="screen-reader-text">
          {this.props.t("search.title")}
        </span>
      </button>
    );
  }
}

export default withTranslation()(SearchMenuButton);
