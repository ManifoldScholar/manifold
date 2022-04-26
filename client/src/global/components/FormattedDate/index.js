import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { format as formatDate, parseISO, formatDistance } from "date-fns";
import isDate from "lodash/isDate";

export default function FormattedDate({
  date,
  format = "PPP",
  prefix,
  suffix = false
}) {
  const { t } = useTranslation();

  if (!date) return null;

  const parsedDate = isDate(date) ? date : parseISO(date);

  const formatDateString = () => {
    try {
      if (format === "distanceInWords")
        return formatDistance(parsedDate, Date.now(), {
          addSuffix: suffix,
          locale: t("date_fns", { returnObjects: true })
        });
      return formatDate(parsedDate, format, {
        locale: t("date_fns", { returnObjects: true })
      });
    } catch {
      return "";
    }
  };

  const addPrefix = dateStr => {
    return prefix ? `${prefix} ${dateStr}` : dateStr;
  };

  return (
    <time dateTime={parsedDate.toISOString()}>
      {addPrefix(formatDateString())}
    </time>
  );
}

FormattedDate.displayName = "FormattedDate";

FormattedDate.propTypes = {
  prefix: PropTypes.string,
  format: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};
