import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function Time({ time }) {
  const { t, i18n } = useTranslation();
  const localeParams = {
    minimumIntegerDigits: 2,
    useGrouping: false
  };
  const hours = Math.floor(time / 60 / 60).toLocaleString(
    i18n.language,
    localeParams
  );
  const minutes = Math.floor((time - hours * 60 * 60) / 60).toLocaleString(
    i18n.language,
    localeParams
  );
  const seconds = Math.floor(
    time - hours * 60 * 60 - minutes * 60
  ).toLocaleString(i18n.language, localeParams);

  const values =
    hours > 0
      ? [
          hours,
          minutes,
          t("dates.hours_truncated"),
          t("dates.minutes_truncated"),
          t("dates.hours"),
          t("dates.minutes")
        ]
      : [
          minutes,
          seconds,
          t("dates.minutes_truncated"),
          t("dates.seconds_truncated"),
          t("dates.minutes"),
          t("dates.seconds")
        ];

  return (
    <figure>
      <div aria-hidden className="analytics-time-block">
        <span className="analytics-time-block__value analytics-time-block__value--minute">{`${values[0]}`}</span>
        <span className="analytics-time-block__divider">:</span>
        <span className="analytics-time-block__value analytics-time-block__value--second">{`${values[1]}`}</span>
        <span className="analytics-time-block__label analytics-time-block__label--minute">
          {values[2]}
        </span>
        <span className="analytics-time-block__label analytics-time-block__label--second">
          {values[3]}
        </span>
      </div>
      <span className="screen-reader-text">{`${values[0]} ${values[4]} ${values[1]} ${values[5]}`}</span>
    </figure>
  );
}

Time.propTypes = {
  time: PropTypes.number.isRequired
};

Time.displayName = "Analytics.Block.Time";

export default Time;
