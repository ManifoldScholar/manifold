import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import format from "date-fns/format";

export default function DatePickerHeader({
  date,
  increaseMonth,
  decreaseMonth,
  uid
}) {
  const { t } = useTranslation();

  return (
    <div className="react-datepicker__header">
      <button
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--next"
        onClick={increaseMonth}
      >
        <IconComposer icon="arrowRight16" size={20} />
      </button>
      <button
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--previous"
        onClick={decreaseMonth}
      >
        <IconComposer icon="arrowLeft16" size={20} />
      </button>
      <div
        id={`range-picker-dialog-label-${uid}`}
        className="react-datepicker__current-month"
      >
        {format(date, "MMMM yyyy", {
          locale: t("date_fns", { returnObjects: true })
        })}
      </div>
    </div>
  );
}

DatePickerHeader.displayName = "Form.DatePicker.Header";

DatePickerHeader.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  decreaseMonth: PropTypes.func.isRequired,
  increaseMonth: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired
};
