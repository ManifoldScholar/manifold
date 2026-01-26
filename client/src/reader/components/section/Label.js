import PropTypes from "prop-types";

export default function Label({ label }) {
  return (
    <div className="section-category-label">
      <div className="container flush">
        <div className="section-category-label__label">{label}</div>
      </div>
    </div>
  );
}

Label.propTypes = {
  label: PropTypes.string.isRequired
};
