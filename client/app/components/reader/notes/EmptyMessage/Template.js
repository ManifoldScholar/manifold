import React from "react";
import PropTypes from "prop-types";

function Template({ title, body }) {
  return (
    <div className="notes-message">
      <h3 className="heading-primary">{title}</h3>
      <p>{body}</p>
    </div>
  );
}

Template.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
};

export default Template;
