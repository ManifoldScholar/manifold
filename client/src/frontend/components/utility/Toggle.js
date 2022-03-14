import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

class Toggle extends Component {
  static displayName = "Utility.Toggle";

  static propTypes = {
    handleToggle: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    optionOne: PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string
    }).isRequired,
    optionTwo: PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string
    }).isRequired,
    selected: PropTypes.string,
    t: PropTypes.func
  };

  get selected() {
    return this.props.selected;
  }

  get options() {
    return [this.props.optionOne, this.props.optionTwo];
  }

  get unselected() {
    const unselected = this.options.find(
      option => this.selected !== option.label
    );
    return unselected ? unselected.label : null;
  }

  get idPrefix() {
    return "button-switch";
  }

  handleClick = event => {
    event.preventDefault();
    this.props.handleToggle();
  };

  renderOption(option, id, index) {
    const selected = this.props.selected === option.label;
    const optionClasses = classNames({
      radio: true,
      "button-switch-primary__side": true,
      "button-switch-primary__side--selected": selected
    });

    return (
      <label
        key={option.label}
        htmlFor={`${id}-${option.label}`}
        className={optionClasses}
      >
        {option.icon && (
          <IconComposer
            icon={option.icon}
            size={30}
            className="button-switch-primary__icon"
          />
        )}
        <span className="button-switch-primary__label">
          {option.translatedLabel ? option.translatedLabel : option.label}
        </span>
        <input
          type="radio"
          id={`${id}-${option.label}`}
          name={id}
          value={option.label}
          checked={selected}
          onChange={this.props.handleToggle}
          className="button-switch-primary__input"
          tabIndex={index === 0 ? 0 : -1}
        />
      </label>
    );
  }

  render() {
    if (!this.props.optionOne || !this.props.optionTwo) return null;
    const options = [this.props.optionOne, this.props.optionTwo];

    return (
      <UIDConsumer name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <div
            role="group"
            aria-describedby={id}
            className="button-switch-primary"
          >
            {options.map((option, index) =>
              this.renderOption(option, id, index)
            )}
            <span id={id} className="screen-reader-text">
              {this.props.t("actions.toggle_to_state", {
                label: this.props.label,
                state: this.unselected
              })}
            </span>
          </div>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(Toggle);
