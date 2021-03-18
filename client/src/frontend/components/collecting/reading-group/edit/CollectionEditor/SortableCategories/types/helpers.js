import PropTypes from "prop-types";
import classNames from "classnames";

export const collectedShape = {
  categoryId: PropTypes.string.isRequired,
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  showDropzone: PropTypes.bool
};

export const blockClassName = active => {
  return classNames({
    "group-collection-editor__collectable-type": true,
    "group-collection-editor__collectable-type--active": active
  });
};
