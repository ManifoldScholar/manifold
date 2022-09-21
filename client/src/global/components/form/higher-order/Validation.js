import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import brackets2dots from "brackets2dots";

export default class FormHigherOrderValidation extends Component {
  static displayName = "Form.HigherOrder.Validation";

  static propTypes = {
    validation: PropTypes.array,
    submitted: PropTypes.bool,
    errorHandler: PropTypes.func,
    value: PropTypes.any,
    name: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
    onChange: PropTypes.func,
    setValue: PropTypes.func,
    idForError: PropTypes.string
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.submitted && this.props.submitted) {
      this.validateValue();
    }
    if (prevState.errors !== this.state.errors) {
      this.reportErrorStateChange();
    }
  }

  reportErrorStateChange() {
    if (!this.props.errorHandler) return;
    const hasErrors = Object.keys(this.state.errors).length > 0;
    this.props.errorHandler(this.props.name, hasErrors);
  }

  validate(value) {
    this.props.validation.forEach(validation => {
      if (validation === "required") this.validateRequired(value);
    });
  }

  validateValue() {
    this.validate(this.props.value);
  }

  validateRequired(value) {
    const key = "required";
    if (value === "" || value === null) {
      this.addError(key, "is required");
    } else {
      this.removeError(key);
    }
  }

  pointerFor(name) {
    const dotNotation = brackets2dots(name);
    const jsonPointer = dotNotation.replace(".", "/");
    return `/data/${jsonPointer}`;
  }

  removeError(key) {
    const errors = { ...this.state.errors };
    delete errors[key];
    this.setState({ errors });
  }

  addError(key, detail) {
    const error = {
      detail,
      source: {
        pointer: this.pointerFor(this.props.name)
      }
    };
    const errors = { ...this.state.errors, [key]: error };
    this.setState({ errors });
  }

  proxyOnChange(callback) {
    return event => {
      this.validate(event.target.value);
      callback(event);
    };
  }

  proxySetValue(callback) {
    return value => {
      this.validate(value);
      callback(value);
    };
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      validation,
      children,
      errorHandler,
      submitted,
      idForError,
      ...transfer
    } = this.props;
    /* eslint-enable no-unused-vars */
    if (!this.props.validation) {
      return React.cloneElement(children, transfer);
    }
    if (transfer.hasOwnProperty("onChange")) {
      transfer.onChange = this.proxyOnChange(this.props.onChange);
    }
    if (transfer.hasOwnProperty("setValue")) {
      transfer.setValue = this.proxySetValue(this.props.setValue);
    }

    return (
      <div>
        {React.cloneElement(this.props.children, transfer)}
        <GlobalForm.InputError
          idForError={idForError}
          errors={Object.values(this.state.errors)}
        />
      </div>
    );
  }
}
