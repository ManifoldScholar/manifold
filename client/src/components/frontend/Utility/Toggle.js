import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class Toggle extends Component {
  static displayName = "Utility.Toggle";

  static propTypes = {
    handleToggle: PropTypes.func.isRequired,
    optionOne: PropTypes.shape({
      iconClass: PropTypes.string,
      label: PropTypes.string
    }).isRequired,
    optionTwo: PropTypes.shape({
      iconClass: PropTypes.string,
      label: PropTypes.string
    }).isRequired,
    selected: PropTypes.string
  };

  handleClick = event => {
    event.preventDefault();
    this.props.handleToggle();
  };

  renderOption(option) {
    const selected = this.props.selected === option.label;
    const optionClasses = classNames("button", { selected });

    return (
      <div key={option.label} className={optionClasses}>
        {option.iconClass ? (
          <i className={`manicon ${option.iconClass}`} aria-hidden="true" />
        ) : null}
        {option.label}
      </div>
    );
  }

  render() {
    if (!this.props.optionOne || !this.props.optionTwo) return null;
    const options = [this.props.optionOne, this.props.optionTwo];

    return (
      <div className="button-switch-primary">
        <div className="wrapper" onClick={this.handleClick} role="button">
          {options.map(option => {
            return this.renderOption(option);
          })}
        </div>
      </div>
    );
  }
}
