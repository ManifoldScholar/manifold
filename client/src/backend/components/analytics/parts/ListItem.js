import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

function ListItem({ icon, label, value }) {
  return (
    <li className="analytics-list-item">
      <span className="analytics-list-item__label">
        <Utility.IconComposer
          icon={icon}
          size={32}
          className="analytics-list-item__icon"
        />
        <h4>{label}</h4>
      </span>
      <span className="analytics-list-item__value">{`${value}`}</span>
    </li>
  );
}

ListItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

ListItem.displayName = "Analytics.Block.List.ListItem";

export default ListItem;
