import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import sharedPropsValidation from '../propTypes';
import classNames from 'classnames';
import parse from 'date-fns/parse';
import range from 'lodash/range';
import getMonth from 'date-fns/get_month';
import getDate from 'date-fns/get_date';
import getYear from 'date-fns/get_year';
import isEqual from 'date-fns/is_equal';
import getDaysInMonth from 'date-fns/get_days_in_month';
import MaskedInput from 'react-text-mask';

export default class FormDateInput extends PureComponent {

  static displayName = "Form.Helpers.DateInput";

  static propTypes = {
  };

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.months = [
      "January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];

    const parts = this.dateToUserInput(this.parse(props.value));

    this.state = {
      input: parts,
      validated: this.validate(parts)
    };
    this.setInputMonth = this.setInputMonth.bind(this);
    this.setInputDay = this.setInputDay.bind(this);
    this.setInputYear = this.setInputYear.bind(this);
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.validated !== this.state.validated) {
      this.broadcastValue();
    }
    if (prevState.input !== this.state.input) {
      this.setState({ validated: this.validate(this.state.input) });
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value &&
      nextProps.value !== "" && nextProps.value !== null) {
      const parts = this.dateToUserInput(this.parse(nextProps.value));
      const newState = {
        input: parts,
        validated: this.validate(parts)
      };
      this.setState(newState);
    }
  }

  broadcastValue() {
    const newValue = this.validStateDate();
    if (isEqual(newValue, this.props.value)) return;
    this.props.setValue(newValue);
  }

  dateToUserInput(date) {
    const parts = this.dateToStateObject(date);
    return {
      month: parts.month.toString(),
      day: parts.day.toString(),
      year: parts.year.toString()
    };
  }

  validate(parts) {
    let month = parseInt(parts.month, 10);
    let day = parseInt(parts.day, 10);
    let year = parts.year;
    month = (month >= 0 && month <= 11) ? month : null;
    year = (year && year.match(/^\d{4}$/)) ? parseInt(year, 10) : null;
    day = (day >= 0 && day <= 31) ? day : null;
    if (month === null || day === null || year === null) return null;
    return { month, year, day };
  }

  isValid() {
    if (!this.state.validated) return false;
    return this.state.validated.month &&
      this.state.validated.day && this.state.validated.year;
  }

  validStateDate() {
    const v = this.state.validated;
    if (v === null) return null;
    return new Date(v.year, v.month, v.day);
  }

  parse(string) {
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

  setInputDay(event) {
    const input = Object.assign({}, this.state.input);
    input.day = event.target.value;
    this.setState({ input });
  }

  setInputMonth(event) {
    const input = Object.assign({}, this.state.input);
    input.month = event.target.value;
    const max = this.maxDayForMonthAndYear(input.month, input.year);
    input.day = input.day > max ? max : input.day;
    this.setState({ input });
  }

  setInputYear(event) {
    const input = Object.assign({}, this.state.input);
    input.year = event.target.value;
    const max = this.maxDayForMonthAndYear(input.month, input.year);
    input.day = input.day > max ? max : input.day;
    this.setState({ input });
  }

  render() {
    return (
      <div className="form-date">
        <div className="form-select input-month">
          <i className="manicon manicon-caret-down"></i>
          <select onChange={this.setInputMonth} value={this.state.input.month} >
            <option></option>
            {this.months.map((month, index) => {
              return (
                <option value={index} key={index}>{month}</option>
              );
            })}
          </select>
        </div>
        <div className="form-select input-day">
          <i className="manicon manicon-caret-down"></i>
          <select onChange={this.setInputDay} value={this.state.input.day} >
            <option></option>
            {this.days().map((day, index) => {
              return (
                <option key={index}>{day}</option>
              );
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
    );
  }

}
