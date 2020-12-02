import React from "react";
import PropTypes from "prop-types";

function Time({ minutes, seconds }) {
  return (
    <figure>
      <div aria-hidden className="analytics-time-block">
        <span className="analytics-time-block__value analytics-time-block__value--minute">{`${minutes}`}</span>
        <span className="analytics-time-block__divider">:</span>
        <span className="analytics-time-block__value analytics-time-block__value--second">{`${seconds}`}</span>
        <span className="analytics-time-block__label analytics-time-block__label--minute">
          min
        </span>
        <span className="analytics-time-block__label analytics-time-block__label--second">
          sec
        </span>
      </div>
      <span className="screen-reader-text">{`${minutes} minutes, ${seconds} seconds`}</span>
    </figure>
  );
}

Time.propTypes = {
  minutes: PropTypes.string.isRequired,
  seconds: PropTypes.string.isRequired
};

Time.displayName = "Analytics.Block.Time";

export default Time;
