import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import subWeeks from "date-fns/subWeeks";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import subMonths from "date-fns/subMonths";
import DatePicker from "./DatePicker";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

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
    label: "Last week",
    ...getLastWeekDates()
  },
  {
    key: 1,
    label: "Last month",
    ...getLastMonthDates()
  },
  {
    key: 2,
    label: "Last 7 days",
    start: subDays(today, 7),
    end: today
  },
  {
    key: 3,
    label: "Last 30 days",
    start: subDays(today, 30),
    end: today
  }
];

function humanReadableDate(date) {
  return format(date, "MMMM d, yyyy");
}

function RangePicker({
  onNewRangeSelected,
  defaultStart,
  defaultEnd,
  className,
  setScreenReaderStatus
}) {
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    if (!startDate || !endDate) return;
    onNewRangeSelected(startDate, endDate);
  }, [startDate, endDate]);

  const handleInvalidStart = () => {
    const newDate = subDays(endDate, 1);
    setStartDate(newDate);
    setScreenReaderStatus(
      `The start date must come before the selected end date. Updating the start date to ${humanReadableDate(
        newDate
      )}.`
    );
  };

  const handleInvalidEnd = () => {
    const newDate = addDays(startDate, 1);
    setEndDate(newDate);
    setScreenReaderStatus(
      `The end date must come after the selected start date. Updating the end date to ${humanReadableDate(
        newDate
      )}.`
    );
  };

  const validateAndSetStart = start => {
    if (!isBefore(start, endDate)) return handleInvalidStart();
    setStartDate(start);
    setScreenReaderStatus(`You entered ${humanReadableDate(start)}.`);
  };

  const validateAndSetEnd = end => {
    if (isBefore(end, startDate)) return handleInvalidEnd();
    setEndDate(end);
    setScreenReaderStatus(`You entered ${humanReadableDate(end)}.`);
  };

  const handlePresetClick = ({ start, end }) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <UID>
      {id => (
        <div className={`range-picker ${className}`}>
          <div className="range-picker__section">
            <DatePicker
              parentId={id}
              inputId={`range-picker-${id}-start-date`}
              value={startDate}
              onChange={validateAndSetStart}
              label="Start Date"
            />
          </div>
          <div className="range-picker__section">
            <DatePicker
              parentId={id}
              inputId={`range-picker-${id}-end-date`}
              value={endDate}
              onChange={validateAndSetEnd}
              label="Start Date"
            />
          </div>
          <div className="range-picker__section">
            <fieldset className="range-picker__preset-group">
              <legend className="range-picker__label">
                Choose a range preset
              </legend>
              <div className="range-picker__preset-group-inner">
                {presets.map(({ key, label, ...dateProps }) => (
                  <button
                    key={key}
                    onClick={() => handlePresetClick(dateProps)}
                    className="range-picker__preset button-lozenge"
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      )}
    </UID>
  );
}

RangePicker.displayName = "Analytics.RangePicker";

RangePicker.propTypes = {
  onNewRangeSelected: PropTypes.func.isRequired,
  defaultStart: PropTypes.instanceOf(Date).isRequired,
  defaultEnd: PropTypes.instanceOf(Date).isRequired,
  className: PropTypes.string
};

export default withScreenReaderStatus(RangePicker);
