import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

function CategoryCreator({ onSubmit }) {
  const uid = useUID();
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setValue("");
    onSubmit({ title: value });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="collection-category-builder__category-creator"
    >
      <label htmlFor={uid} className="collection-category-builder__label">
        Create a new category:
      </label>
      <div className="collection-category-builder__input-container">
        <input
          id={uid}
          type="text"
          value={value}
          onChange={({ target: { value } }) => setValue(value)}
          placeholder="Enter Category Name…"
          required
          className="collection-category-builder__input"
        />
        <button
          type="submit"
          className="collection-category-builder__submit-button"
        >
          <IconComposer icon="circlePlus32" size={32} />
          <span>Add</span>
        </button>
      </div>
    </form>
  );
}

CategoryCreator.displayName = "ReadingGroup.Collecting.CollectionEditor.CategoryCreator";

CategoryCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CategoryCreator;
