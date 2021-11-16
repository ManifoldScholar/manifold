import PropTypes from "prop-types";

export const filters = PropTypes.shape({
  filterChangeHandler: PropTypes.func,
  initialFilterState: PropTypes.object,
  resetFilterState: PropTypes.object,
  subjects: PropTypes.array
});
export const pagination = PropTypes.object;
export const count = PropTypes.object;
