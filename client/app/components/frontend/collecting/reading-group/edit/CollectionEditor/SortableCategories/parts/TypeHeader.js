import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function CategoryTypeHeader({ heading }) {
  return (
    <header>
      <Styled.TypeHeaderText>{heading}</Styled.TypeHeaderText>
    </header>
  );
}

CategoryTypeHeader.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.CollectableTypeHeader";

CategoryTypeHeader.propTypes = {
  heading: PropTypes.string.isRequired
};

export default CategoryTypeHeader;
