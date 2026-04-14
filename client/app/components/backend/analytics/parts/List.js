import React from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";

function List({ items }) {
  return (
    <ul className="analytics-block__list">
      {/* eslint-disable react/no-array-index-key */}
      {items.map((item, index) => (
        <ListItem key={index} {...item} />
      ))}
      {/* eslint-enable react/no-array-index-key */}
    </ul>
  );
}

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  )
};

List.displayName = "Analytics.Block.List";

export default List;
