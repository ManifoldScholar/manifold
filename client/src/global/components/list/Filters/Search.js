import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import Utility from "global/components/utility";

function Search({ inputRef, value, onChange }) {
  const uid = useUID();

  return (
    <div className="form-list-filter__search-field">
      <button className="form-list-filter__search-button" type="submit">
        <span className="screen-reader-text">Search…</span>
        <Utility.IconComposer
          icon="search16"
          size={20}
          iconClass="form-list-filter__search-icon"
        />
      </button>
      <label htmlFor={uid} className="screen-reader-text">
        Enter Search Criteria
      </label>
      <input
        ref={inputRef}
        value={value}
        type="text"
        id={uid}
        onChange={onChange}
        placeholder="Search…"
        className="form-list-filter__text-input form-list-filter__text-input--search"
      />
    </div>
  );
}

Search.displayName = "Global.List.Filters.Search";

Search.propTypes = {
  inputRef: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Search;
