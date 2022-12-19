import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import setter from "../setter";
import Errorable from "global/components/form/Errorable";
import PickerComponent from "./PickerComponent";
import isDate from "lodash/isDate";
import format from "date-fns/format";
import Instructions from "../Instructions";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";

class DatePicker extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    setFormat: PropTypes.string,
    set: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    wide: PropTypes.bool,
    t: PropTypes.func
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

  handleChange = date => {
    this.props.set(date ? format(date, this.props.setFormat) : null);
    this.props.setScreenReaderStatus(
      date
        ? this.props.t("forms.date_picker.date_change_sr_status", {
            date: format(date, "PPP")
          })
        : this.props.t("forms.date_picker.date_clear_sr_status")
    );
  };

  render() {
    const { name, errors, label } = this.props;

    return (
      <UIDConsumer>
        {id => (
          <Errorable
            className={this.props.wide ? "wide" : undefined}
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
            {this.props.instructions && (
              <Instructions instructions={this.props.instructions} />
            )}
          </Errorable>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(setter(withScreenReaderStatus(DatePicker)));
