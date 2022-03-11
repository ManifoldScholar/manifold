import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { format as formatDate, parseISO, formatDistance } from "date-fns";
import es from "date-fns/locale/es";
import nl from "date-fns/locale/nl";
import isDate from "lodash/isDate";

export default function FormattedDate({
  date,
  format = "PPP",
  prefix,
  suffix = false
}) {
  const lng = useSelector(state => state.ui.persistent.locale.language);
  const locale = useMemo(() => {
    switch (lng) {
      case "es":
        return es;
      case "nl":
        return nl;
      default:
        return null;
    }
  }, [lng]);

  if (!date) return null;

  const parsedDate = isDate(date) ? date : parseISO(date);

  const dateTime = () => {
    try {
      return formatDate(parsedDate, format, { locale });
    } catch {
      return "";
    }
  };

  const formatDateString = () => {
    try {
      if (format === "distanceInWords")
        return formatDistance(parsedDate, Date.now(), {
          addSuffix: suffix,
          locale
        });
      return formatDate(parsedDate, format);
    } catch {
      return "";
    }
  };

  const addPrefix = dateStr => {
    return prefix ? `${prefix} ${dateStr}` : dateStr;
  };

  if (!date) return null;
  return <time dateTime={dateTime()}>{addPrefix(formatDateString())}</time>;
}

FormattedDate.displayName = "FormattedDate";

FormattedDate.propTypes = {
  prefix: PropTypes.string,
  format: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};
