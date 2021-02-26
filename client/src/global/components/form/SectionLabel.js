import React from 'react';
import PropTypes from 'prop-types';

function SectionLabel({ label, as = "header", id }) {
  const Tag = as;

  return (
    <Tag className="form-section-label">
      <h2 id={id}>{label}</h2>
    </Tag>
  )
}

SectionLabel.displayName = "Form.SectionLabel";

SectionLabel.propTypes = {
  label: PropTypes.string.isRequired,
  as: PropTypes.string,
  id: PropTypes.string,
  secondary: PropTypes.bool,
}

export default SectionLabel;
