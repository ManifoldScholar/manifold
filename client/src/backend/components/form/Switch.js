import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { UID } from "react-uid";
import setter from "./setter";
import Instructions from "./Instructions";

class FormSwitch extends Component {
  static displayName = "Form.Switch";

  static propTypes = {
    label: PropTypes.string,
    labelPos: PropTypes.string,
    className: PropTypes.string,
    labelClass: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    set: PropTypes.func,
    value: PropTypes.any,
    customValues: PropTypes.shape({
      true: PropTypes.string,
      false: PropTypes.string
    }),
    focusOnMount: PropTypes.bool,
    wide: PropTypes.bool
  };

  static defaultProps = {
    labelPos: "above",
    focusOnMount: false
  };

  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  componentDidMount() {
    if (this.props.focusOnMount) {
      this.focus();
    }

    window.addEventListener("keydown", event => {
      this.handleKeyPress(event);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  get labelClasses() {
    return classnames(
      "form-input-heading",
      "toggle",
      this.props.labelPos,
      this.props.labelClass
    );
  }

  get switchClasses() {
    return classnames({
      "boolean-primary": true,
      checked: this.checked
    });
  }

  get wrapperClasses() {
    return classnames(
      {
        "form-input": true,
        wide: this.props.wide
      },
      this.props.className
    );
  }

  get checked() {
    return this.determineChecked(this.props.value);
  }

  get idPrefix() {
    return "switch-input";
  }

  get idForInstructionsPrefix() {
    return "switch-input-instructions";
  }

  truthy(value) {
    return value === true || value === "true";
  }

  handleClick = event => {
    event.preventDefault();
    if (this.props.customValues) return this.handleCustomValues();
    return this.handleBooleans();
  };

  handleKeyPress = event => {
    const spaceOrEnter = event.keyCode === 32 || event.keyCode === 13;
    if (spaceOrEnter && this.state.focused) {
      event.preventDefault();
      event.stopPropagation();
      if (this.props.customValues) return this.handleCustomValues();
      return this.handleBooleans();
    }
  };

  handleCustomValues() {
    const trueValue = this.props.customValues.true;
    const falseValue = this.props.customValues.false;
    if (this.props.value === trueValue) return this.props.set(falseValue);
    return this.props.set(trueValue);
  }

  handleBooleans() {
    this.props.set(!this.truthy(this.props.value));
  }

  determineChecked(value) {
    if (this.props.customValues) return value === this.props.customValues.true;
    return this.truthy(value);
  }

  focus = () => {
    this.setState({ focused: true });
    if (this.button) {
      this.button.focus();
    }
  };

  blur = () => {
    this.setState({ focused: false });
  };

  renderLabel(id) {
    return (
      <label className={this.labelClasses} htmlFor={id}>
        {this.props.label}
      </label>
    );
  }

  render() {
    return (
      <UID>
        {id => (
          <div className={this.wrapperClasses}>
            {this.props.labelPos === "above" &&
              this.renderLabel(`${this.idPrefix}-${id}`)}
            <div className="toggle-indicator">
              {/* Add .checked to .boolean-primary to change visual state */}
              <div
                ref={b => {
                  this.button = b;
                }}
                onFocus={this.focus}
                onBlur={this.blur}
                onClick={this.handleClick}
                className={this.switchClasses}
                role="button"
                tabIndex="0"
                aria-pressed={this.checked}
                id={`${this.idPrefix}-${id}`}
                aria-describedby={`${this.idForInstructionsPrefix}-${id}`}
              >
                <span className="screen-reader-text">{this.props.label}</span>
              </div>
            </div>
            {this.props.labelPos === "below" &&
              this.renderLabel(`${this.idPrefix}-${id}`)}
            <Instructions
              instructions={this.props.instructions}
              id={`${this.idForInstructionsPrefix}-${id}`}
            />
          </div>
        )}
      </UID>
    );
  }
}

export default setter(FormSwitch);
