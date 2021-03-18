import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

function CategoryCreator({ onSubmit }) {
  const uid = useUID();
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ title: inputValue });
    setInputValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group-collection-editor__category-creator"
    >
      <label htmlFor={uid} className="group-collection-editor__label">
        Create a new category:
      </label>
      <div className="group-collection-editor__input-container">
        <input
          id={uid}
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => setInputValue(value)}
          placeholder="Enter Category Name…"
          required
          className="group-collection-editor__input"
        />
        <button
          type="submit"
          className="group-collection-editor__submit-button"
        >
          <IconComposer icon="circlePlus32" size={32} />
          <span>Add</span>
        </button>
      </div>
    </form>
  );
}

CategoryCreator.displayName =
  "ReadingGroup.Collecting.CollectionEditor.CategoryCreator";

CategoryCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CategoryCreator;
