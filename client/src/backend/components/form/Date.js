import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import setter from "./setter";
import parse from "date-fns/parse";
import range from "lodash/range";
import getMonth from "date-fns/get_month";
import getDate from "date-fns/get_date";
import getYear from "date-fns/get_year";
import isEqual from "date-fns/is_equal";
import getDaysInMonth from "date-fns/get_days_in_month";
import GlobalForm from "global/components/form";
import labelId from "helpers/labelId";
import MaskedInput from "react-text-mask";
import isNull from "lodash/isNull";
import IconComposer from "global/components/utility/IconComposer";

class FormDate extends Component {
  static displayName = "Form.Date";

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    label: PropTypes.string,
    set: PropTypes.func.isRequired,
    submitKey: PropTypes.string,
    name: PropTypes.string,
    errors: PropTypes.array,
    id: PropTypes.string,
    idForError: PropTypes.string,
    wide: PropTypes.bool
  };

  static defaultProps = {
    id: labelId("date-input-"),
    idForError: labelId("date-input-error-")
  };

  constructor(props) {
    super(props);
    this.months = [
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
    const parts = this.dateToUserInput(this.parse(props.value));

    this.state = {
      input: parts,
      validated: this.validate(parts)
    };
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate(prevProps, prevState) {
    if (this.validateFormSubmit(prevProps)) {
      this.updateStateFromPropValue(this.props.value);
    }
    if (prevState.validated !== this.state.validated) {
      this.broadcastValue();
    }
    if (prevState.input !== this.state.input) {
      this.setState({ validated: this.validate(this.state.input) });
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  setInputDay = event => {
    const input = Object.assign({}, this.state.input);
    input.day = event.target.value;
    this.setState({ input });
  };

  setInputMonth = event => {
    const input = Object.assign({}, this.state.input);
    input.month = event.target.value;
    const max = this.maxDayForMonthAndYear(input.month, input.year);
    input.day = input.day > max ? max : input.day;
    this.setState({ input });
  };

  setInputYear = event => {
    const input = Object.assign({}, this.state.input);
    input.year = event.target.value;
    const max = this.maxDayForMonthAndYear(input.month, input.year);
    input.day = input.day > max ? max : input.day;
    this.setState({ input });
  };

  validateFormSubmit(prevProps) {
    if (prevProps.submitKey === this.props.submitKey) return false;
    return (
      prevProps.value !== this.props.value &&
      prevProps.value !== "" &&
      prevProps.value !== null
    );
  }

  updateStateFromPropValue(value) {
    const parts = this.dateToUserInput(this.parse(value));
    const newState = {
      input: parts,
      validated: this.validate(parts)
    };
    this.setState(newState);
  }

  validate(parts) {
    let month = parseInt(parts.month, 10);
    let day = parseInt(parts.day, 10);
    let year = parts.year;
    month = month >= 0 && month <= 11 ? month : null;
    year = year && year.match(/^\d{4}$/) ? parseInt(year, 10) : null;
    day = day >= 0 && day <= 31 ? day : null;
    if (month === null || day === null || year === null) return null;
    return { month, year, day };
  }

  dateToUserInput(date) {
    const parts = this.dateToStateObject(date);
    return {
      month: parts.month.toString(),
      day: parts.day.toString(),
      year: parts.year.toString()
    };
  }

  broadcastValue() {
    const newValue = this.validStateDate();
    if (isEqual(newValue, this.props.value)) return;
    this.props.set(newValue);
  }

  isValid() {
    if (!this.state.validated) return false;
    return (
      this.state.validated.month &&
      this.state.validated.day &&
      this.state.validated.year
    );
  }

  validStateDate() {
    const v = this.state.validated;
    if (v === null) return null;
    return new Date(v.year, v.month, v.day);
  }

  parse(string) {
    if (isNull(string)) return null;
    if (string === "") return null;
    return parse(string);
  }

  maxDayForMonthAndYear(month, year) {
    if (!parseInt(month, 10) || !parseInt(year, 10)) return 31;
    const date = new Date(year, month, 1);
    const max = getDaysInMonth(date);
    return max;
  }

  days() {
    const end = this.isValid() ? getDaysInMonth(this.validStateDate()) + 1 : 32;
    return range(1, end);
  }

  dateToStateObject(date) {
    const out = { month: "", day: "", year: "" };
    if (date == null) return out;
    out.month = getMonth(date);
    out.day = getDate(date);
    out.year = getYear(date);
    return out;
  }

  renderSelectIcon() {
    return (
      <div className="form-select__icon">
        <IconComposer icon="disclosureDown16" size={20} />
      </div>
    );
  }

  render() {
    const inputClasses = classnames({
      "form-input": true,
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
        <div className="form-date">
          <div className="form-select input-month">
            {this.renderSelectIcon()}
            <select
              onChange={this.setInputMonth}
              value={this.state.input.month}
            >
              <option />
              {this.months.map((month, index) => {
                return (
                  <option value={index} key={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-select input-day">
            {this.renderSelectIcon()}
            <select onChange={this.setInputDay} value={this.state.input.day}>
              <option />
              {this.days().map(day => {
                return <option key={day}>{day}</option>;
              })}
            </select>
          </div>
          <div className="form-input">
            <MaskedInput
              type="text"
              mask={[/\d/, /\d/, /\d/, /\d/]}
              className="input-year"
              onChange={this.setInputYear}
              value={this.state.input.year}
            />
          </div>
        </div>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormDate);
