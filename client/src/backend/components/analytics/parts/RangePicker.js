import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import subWeeks from "date-fns/subWeeks";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import subMonths from "date-fns/subMonths";
import DatePicker from "global/components/form/DatePicker/PickerComponent";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { useTranslation } from "react-i18next";

const today = new Date();

const getLastWeekDates = () => {
  const weekAgo = subWeeks(today, 1);
  return {
    start: startOfWeek(weekAgo),
    end: endOfWeek(weekAgo)
  };
};
const getLastMonthDates = () => {
  const monthAgo = subMonths(today, 1);
  return {
    start: startOfMonth(monthAgo),
    end: endOfMonth(monthAgo)
  };
};

const presets = [
  {
    key: 0,
    label: "analytics.last_week",
    ...getLastWeekDates()
  },
  {
    key: 1,
    label: "analytics.last_month",
    ...getLastMonthDates()
  },
  {
    key: 2,
    label: "analytics.last_count_days",
    count: "7",
    start: subDays(today, 7),
    end: today
  },
  {
    key: 3,
    label: "analytics.last_count_days",
    count: "30",
    start: subDays(today, 30),
    end: today
  }
];

function RangePicker({
  onNewRangeSelected,
  initialStart,
  initialEnd,
  className,
  setScreenReaderStatus
}) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const { t } = useTranslation();

  const humanReadableDate = date => {
    return t("dates.date", {
      val: date,
      formatParams: {
        val: { year: "numeric", month: "long", day: "numeric" }
      }
    });
  };

  useEffect(() => {
    if (!startDate || !endDate) return;
    onNewRangeSelected(startDate, endDate);
  }, [startDate, endDate, onNewRangeSelected]);

  const handleInvalidStart = () => {
    const newDate = subDays(endDate, 1);
    setStartDate(newDate);
    const date = humanReadableDate(newDate);
    setScreenReaderStatus(t("analytics.invalid_start_date", { date }));
  };

  const handleInvalidEnd = () => {
    const newDate = addDays(startDate, 1);
    setEndDate(newDate);
    const date = humanReadableDate(newDate);
    setScreenReaderStatus(t("analytics.invalid_end_date", { date }));
  };

  const validateAndSetStart = start => {
    if (!isBefore(start, endDate)) return handleInvalidStart();
    setStartDate(start);
    const date = humanReadableDate(start);
    setScreenReaderStatus(t("analytics.you_entered_date", { date }));
  };

  const validateAndSetEnd = end => {
    if (isBefore(end, startDate)) return handleInvalidEnd();
    setEndDate(end);
    const date = humanReadableDate(end);
    setScreenReaderStatus(t("analytics.you_entered_date", { date }));
  };

  const handlePresetClick = ({ start, end }) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <UIDConsumer>
      {id => (
        <div className={`range-picker ${className}`}>
          <div className="range-picker__section">
            <DatePicker
              parentId={id}
              inputId={`range-picker-${id}-start-date`}
              value={startDate}
              onChange={validateAndSetStart}
              label={t("dates.start_date")}
            />
          </div>
          <div className="range-picker__section">
            <DatePicker
              parentId={id}
              inputId={`range-picker-${id}-end-date`}
              value={endDate}
              onChange={validateAndSetEnd}
              label={t("dates.end_date")}
            />
          </div>
          <div className="range-picker__section">
            <fieldset className="range-picker__preset-group">
              <legend className="range-picker__label">
                {t("analytics.choose_date_preset")}
              </legend>
              <div className="range-picker__preset-group-inner">
                {presets.map(({ key, label, count, ...dateProps }) => (
                  <button
                    key={key}
                    onClick={() => handlePresetClick(dateProps)}
                    className="range-picker__preset button-lozenge-secondary"
                  >
                    <span>{t(label, count && { count })}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      )}
    </UIDConsumer>
  );
}

RangePicker.displayName = "Analytics.RangePicker";

RangePicker.propTypes = {
  onNewRangeSelected: PropTypes.func.isRequired,
  initialStart: PropTypes.instanceOf(Date).isRequired,
  initialEnd: PropTypes.instanceOf(Date).isRequired,
  className: PropTypes.string
};

export default withScreenReaderStatus(RangePicker);
