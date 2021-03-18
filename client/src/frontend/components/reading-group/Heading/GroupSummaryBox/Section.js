import React from "react";
import PropTypes from "prop-types";

function GroupSummarySection({ label, columns = 1, children }) {
  return (
    <div className="group-summary__section">
      <h3 className="group-summary__section-label">{label}</h3>
      <div
        className={`group-summary__section-list group-summary__section-list--col-${columns}`}
      >
        {children}
      </div>
    </div>
  );
}

GroupSummarySection.displayName = "ReadingGroup.GroupSummaryBox.Section";

GroupSummarySection.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 2])
};

export default GroupSummarySection;
