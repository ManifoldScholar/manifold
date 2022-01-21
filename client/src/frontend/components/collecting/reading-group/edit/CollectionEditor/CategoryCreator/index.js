import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function CategoryCreator({ onSubmit }) {
  const uid = useUID();
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ title: inputValue });
    setInputValue("");
  }

  return (
    <Styled.CategoryCreator onSubmit={handleSubmit}>
      <Styled.Label htmlFor={uid}>Create a new category:</Styled.Label>
      <Styled.InputWrapper>
        <Styled.Input
          id={uid}
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => setInputValue(value)}
          placeholder="Enter Category Name…"
          required
        />
        <Styled.Button type="submit">
          <IconComposer icon="circlePlus32" size={32} />
          <span>Add</span>
        </Styled.Button>
      </Styled.InputWrapper>
    </Styled.CategoryCreator>
  );
}

CategoryCreator.displayName =
  "ReadingGroup.Collecting.CollectionEditor.CategoryCreator";

CategoryCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CategoryCreator;
