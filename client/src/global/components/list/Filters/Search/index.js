import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import Utility from "global/components/utility";
import * as Styled from "./styles";

function Search({ inputRef, value, onChange }) {
  const uid = useUID();

  return (
    <Styled.Wrapper>
      <Styled.Button type="submit">
        <span className="screen-reader-text">Search…</span>
        <Utility.IconComposer icon="search16" size={20} />
      </Styled.Button>
      <label htmlFor={uid} className="screen-reader-text">
        Enter Search Criteria
      </label>
      <Styled.Input
        ref={inputRef}
        value={value}
        type="text"
        id={uid}
        onChange={onChange}
        placeholder="Search…"
      />
    </Styled.Wrapper>
  );
}

Search.displayName = "Global.List.Filters.Search";

Search.propTypes = {
  inputRef: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Search;
