import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

function GroupSummaryItem({ labelText, icon, children }) {
  return (
    <div className="group-summary__item">
      <dt className="group-summary__term">
        <Utility.LabelWithIcon
          label={labelText}
          icon={icon}
          textStyle={"large"}
        />
      </dt>
      <dd className="group-summary__value">{children}</dd>
    </div>
  );
}

GroupSummaryItem.displayName = "ReadingGroup.GroupSummaryBox.Item";

GroupSummaryItem.propTypes = {
  labelText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string
};

export default GroupSummaryItem;
