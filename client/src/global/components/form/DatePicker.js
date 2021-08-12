import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import setter from "./setter";
import Errorable from "global/components/form/Errorable";
import Header from "./DatePicker/Header";
import MaskedInput from "./MaskedTextInput";
import classnames from "classnames";
import ReactDatePicker from "react-datepicker";
import isDate from "lodash/isDate";
import format from "date-fns/format";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

class DatePicker extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    setFormat: PropTypes.string,
    set: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    wide: PropTypes.bool
  };

  static defaultProps = {
    setFormat: "yyyy-MM-dd",
    placeholder: "MM/DD/YYYY"
  };

  get value() {
    if (!this.props.value) return null;
    const date = isDate(this.props.value)
      ? this.props.value
      : new Date(this.props.value);

    return this.dateUTC(date);
  }

  get mask() {
    return [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
  }

  // The API returns values in UTC, but the JS tries to render dates in the user's local
  // timezone.  The DatePicker library we're using requires an actual Date object, so we can't just
  // send a UTC string.  This function essentially resets the date based on the offset of the
  // user's local timezone.
  dateUTC(date) {
    const adjusted = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(adjusted);
  }

  humanReadableDate(date) {
    return format(date, "MMMM d, yyyy");
  }

  handleChange = date => {
    this.props.set(format(date, this.props.setFormat));
    this.props.setScreenReaderStatus(
      `You entered ${this.humanReadableDate(date)}.`
    );
  };

  clear = () => {
    this.props.set(null);
    this.props.setScreenReaderStatus(`You have cleared the input.`);
  };

  render() {
    const inputClasses = classnames({
      "form-input": true,
      "form-date-picker": true,
      wide: this.props.wide
    });
    const { name, errors, label, placeholder, value } = this.props;

    const PopperContainer = ({ children, className }) => (
      <div aria-hidden className={className}>
        {children}
      </div>
    );

    return (
      <UID>
        {id => (
          <Errorable
            className={inputClasses}
            name={name}
            errors={errors}
            label={label}
            idForError={`date-picker-error-${id}`}
          >
            <ReactDatePicker
              customInput={
                <MaskedInput
                  type="text"
                  mask={this.mask}
                  label={label}
                  autoComplete="off"
                />
              }
              placeholderText={placeholder}
              dropdownMode="scroll"
              dateFormat="MM/dd/yyyy"
              selected={this.value}
              onChange={this.handleChange}
              renderCustomHeader={props => <Header uid={id} {...props} />}
              popperContainer={PopperContainer}
            />
            {value && (
              <button
                type="button"
                className="form-date-picker__button"
                onClick={this.clear}
              >
                Clear
              </button>
            )}
          </Errorable>
        )}
      </UID>
    );
  }
}

export default setter(withScreenReaderStatus(DatePicker));
