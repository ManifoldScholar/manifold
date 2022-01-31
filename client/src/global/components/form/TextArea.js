import React, { Component } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import setter from "./setter";
import Errorable from "global/components/form/Errorable";
import isString from "lodash/isString";
import classnames from "classnames";
import Instructions from "./Instructions";

class FormTextArea extends Component {
  static displayName = "Form.TextArea";

  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    height: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.string,
    errors: PropTypes.array,
    name: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    wide: PropTypes.bool
  };

  static defaultProps = {
    height: 100
  };

  get idPrefix() {
    return "textarea";
  }

  get idForErrorPrefix() {
    return "textarea-error";
  }

  get idForInstructionsPrefix() {
    return "textarea-instructions";
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames({
      "form-input": true,
      wide: this.props.wide
    });

    return (
      <UIDConsumer>
        {id => (
          <div className={inputClasses}>
            <Errorable
              className="form-input"
              name={this.props.name}
              errors={this.props.errors}
              label={this.props.label}
              idForError={`${this.idForErrorPrefix}-${id}`}
            >
              <label htmlFor={`${this.idPrefix}-${id}`} className={labelClass}>
                {this.props.label}
              </label>
              <Instructions
                instructions={this.props.instructions}
                id={`${this.idForInstructionsPrefix}-${id}`}
              />
              <textarea
                id={`${this.idPrefix}-${id}`}
                aria-describedby={`${this.idForErrorPrefix}-${id} ${this.idForInstructionsPrefix}-${id}`}
                style={{ height: this.props.height }}
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                value={this.props.value || ""}
              />
            </Errorable>
          </div>
        )}
      </UIDConsumer>
    );
  }
}

export default setter(FormTextArea);
