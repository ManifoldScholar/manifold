import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import setter from "./setter";
import Errorable from "global/components/form/Errorable";
import PickerComponent from "./DatePicker/PickerComponent";
import classnames from "classnames";
import isDate from "lodash/isDate";
import format from "date-fns/format";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

class DatePicker extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    setFormat: PropTypes.string,
    set: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    wide: PropTypes.bool
  };

  static defaultProps = {
    setFormat: "yyyy-MM-dd"
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

  humanReadableDate(date) {
    return format(date, "MMMM d, yyyy");
  }

  handleChange = date => {
    this.props.set(format(date, this.props.setFormat));
    this.props.setScreenReaderStatus(
      `You entered ${this.humanReadableDate(date)}.`
    );
  };

  render() {
    const inputClasses = classnames({
      "form-input": true,
      "form-date-picker": true,
      wide: this.props.wide
    });
    const { name, errors, label } = this.props;

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
            <PickerComponent
              parentId={id}
              inputId={`range-picker-${id}-start-date`}
              value={this.value}
              onChange={this.handleChange}
              label={label}
            />
          </Errorable>
        )}
      </UID>
    );
  }
}

export default setter(withScreenReaderStatus(DatePicker));
