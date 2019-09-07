import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class DatePickerHeader extends Component {
  static displayName = "Form.DatePicker.Header";

  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    decreaseMonth: PropTypes.func.isRequired,
    increaseMonth: PropTypes.func.isRequired
  };

  get monthName() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return monthNames[this.props.date.getMonth()];
  }

  get year() {
    return this.props.date.getFullYear();
  }

  render() {
    return (
      <div className="react-datepicker__header">
        <button
          type="button"
          className="react-datepicker__navigation react-datepicker__navigation--next"
          onClick={this.props.increaseMonth}
        >
          <IconComposer icon="arrowRight16" size={20} />
        </button>
        <button
          type="button"
          className="react-datepicker__navigation react-datepicker__navigation--previous"
          onClick={this.props.decreaseMonth}
        >
          <IconComposer icon="arrowLeft16" size={20} />
        </button>
        <div className="react-datepicker__current-month">
          {this.monthName} {this.year}
        </div>
      </div>
    );
  }
}
