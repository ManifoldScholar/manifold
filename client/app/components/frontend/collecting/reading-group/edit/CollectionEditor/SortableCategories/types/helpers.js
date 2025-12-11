import PropTypes from "prop-types";

export const collectedShape = {
  categoryId: PropTypes.string.isRequired,
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  showDropzone: PropTypes.bool
};
