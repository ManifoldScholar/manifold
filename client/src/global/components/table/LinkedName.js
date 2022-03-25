import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function LinkedName({ name, tag, to }) {
  const { t } = useTranslation();

  return (
    <span className="table__name">
      {to && (
        <Link to={to} className="table__sr-link">
          {t("tables.generic.view_details")}
        </Link>
      )}
      <span className="table__name-container">{name}</span>
      {tag && <span className="table__tag">{tag}</span>}
    </span>
  );
}

LinkedName.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string.isRequired,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

LinkedName.displayName = "GenericTable.LinkedName";
