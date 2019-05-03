import React, { Component } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";
import classNames from "classnames";

export default class Toggle extends Component {
  static defaultProps = {
    id: labelId("button-switch-")
  };

  static displayName = "Utility.Toggle";

  static propTypes = {
    handleToggle: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
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

  get options() {
    return [this.props.optionOne, this.props.optionTwo];
  }

  get selected() {
    return this.props.selected;
  }

  get unselected() {
    const unselected = this.options.find(
      option => this.selected !== option.label
    );
    return unselected ? unselected.label : null;
  }

  handleClick = event => {
    event.preventDefault();
    this.props.handleToggle();
  };

  renderOption(option) {
    const selected = this.props.selected === option.label;
    const optionClasses = classNames("button-switch-primary__side", {
      "button-switch-primary__side--selected": selected
    });

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
        <button
          className="button-switch-primary__button"
          onClick={this.handleClick}
          aria-describedby={this.props.id}
          type="button"
        >
          <div className="button-switch-primary__wrapper">
            {options.map(option => {
              return this.renderOption(option);
            })}
          </div>
        </button>
        <span id={this.props.id} className="aria-describedby">
          {`Toggle ${this.props.label} to ${this.unselected}`}
        </span>
      </div>
    );
  }
}
