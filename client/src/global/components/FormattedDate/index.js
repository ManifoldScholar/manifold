import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { format as formatDate, parseISO, formatDistance } from "date-fns";
import isDate from "lodash/isDate";

export default function FormattedDate({
  date,
  format = "PPP",
  prefix,
  suffix = false
}) {
  const lng = useSelector(state => state.ui.persistent.locale.language);
  const { i18n } = useTranslation();
  const locale = useMemo(() => i18n.store.data[lng].translation.date_fns, [
    lng,
    i18n.store.data
  ]);

  if (!date) return null;

  const parsedDate = isDate(date) ? date : parseISO(date);

  const dateTime = () => {
    try {
      return formatDate(parsedDate, "P", { locale });
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
      return formatDate(parsedDate, format, { locale });
    } catch {
      return "";
    }
  };

  const addPrefix = dateStr => {
    return prefix ? `${prefix} ${dateStr}` : dateStr;
  };

  return <time dateTime={dateTime()}>{addPrefix(formatDateString())}</time>;
}

FormattedDate.displayName = "FormattedDate";

FormattedDate.propTypes = {
  prefix: PropTypes.string,
  format: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};
