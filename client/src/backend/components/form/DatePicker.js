import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import GlobalForm from "global/components/form";
import Header from "./DatePicker/Header";
import labelId from "helpers/labelId";
import MaskedInput from "./MaskedTextInput";
import classnames from "classnames";
import ReactDatePicker from "react-datepicker";
import isDate from "lodash/isDate";

class DatePicker extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    set: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    wide: PropTypes.bool
  };

  static defaultProps = {
    id: labelId("date-picker-"),
    idForError: labelId("date-picker-error-")
  };

  get value() {
    if (!this.props.value) return null;
    const date = isDate(this.props.value)
      ? this.props.value
      : new Date(this.props.value);

    return this.dateUTC(date);
  }

  // The API returns values in UTC, but the JS tries to render dates in the user's local
  // timezone.  The DatePicker library we're using requires an actual Date object, so we can't just
  // send a UTC string.  This function essentially resets the date based on the offset of the
  // user's local timezone.
  dateUTC(date) {
    const adjusted = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(adjusted);
  }

  handleChange = date => {
    return this.props.set(date);
  };

  clear = () => {
    this.props.set(null);
  };

  render() {
    const inputClasses = classnames({
      "form-input": true,
      "form-date-picker": true,
      wide: this.props.wide
    });

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={this.props.idForError}
      >
        <h4 className="form-input-heading">{this.props.label}</h4>
        <ReactDatePicker
          customInput={
            <MaskedInput
              type="text"
              mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
            />
          }
          placeholderText={this.props.placeholder}
          dropdownMode="scroll"
          dateFormat="MM/dd/yyyy"
          selected={this.value}
          onChange={this.handleChange}
          renderCustomHeader={props => <Header {...props} />}
        />
        {this.props.value && (
          <button
            type="button"
            className="form-date-picker__button"
            onClick={this.clear}
          >
            Clear
          </button>
        )}
      </GlobalForm.Errorable>
    );
  }
}

export default setter(DatePicker);
