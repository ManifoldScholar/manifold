import { useState, useEffect, useRef, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";

function CheckboxMixed({ label: groupLabel, checkboxes, onChange }) {
  const initialState = checkboxes.map(checkbox => checkbox.value);
  const [checked, setChecked] = useState(initialState);
  const allChecked = checked.length === checkboxes.length;

  const inputRef = useRef(null);
  const initializedRef = useRef(false);

  const { t } = useTranslation();
  const id = useId();

  useEffect(() => {
    if (initializedRef.current) {
      onChange(checked);
    } else {
      initializedRef.current = true;
    }

    if (inputRef.current) {
      const isIndeterminate =
        checked.length > 0 && checked.length < checkboxes.length;
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [checked]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateChecked(key) {
    setChecked(prevChecked => {
      const index = prevChecked.indexOf(key);
      return index === -1
        ? [...prevChecked, key]
        : prevChecked.slice(0, index).concat(prevChecked.slice(index + 1));
    });
  }

  const baseId = `search-facets-${id}`;

  return (
    <fieldset className="search-query__filter-group">
      <legend className="search-query__group-label">{groupLabel}</legend>
      <div className="search-query__filter-group-list">
        <div className="search-query__checkbox-controller">
          <label
            htmlFor={`${baseId}[all]`}
            className="search-query__checkbox checkbox checkbox--gray"
          >
            <input
              ref={inputRef}
              id={`${baseId}[all]`}
              type="checkbox"
              checked={allChecked}
              aria-controls={checkboxes
                .map(checkbox => `${baseId}[${checkbox.value}]`)
                .join(" ")}
              onChange={() => setChecked(allChecked ? [] : initialState)}
            />
            <div className="checkbox__indicator" aria-hidden="true">
              <Utility.IconComposer
                icon="checkmark16"
                size="default"
                className="checkbox__icon"
              />
            </div>
            {t("search.everything")}
          </label>
        </div>
        <ul className="search-query__filter-group-list">
          {checkboxes.map(({ label, value }) => {
            const index = checked.indexOf(value);
            return (
              <li key={value}>
                <label
                  htmlFor={`${baseId}[${value}]`}
                  className="search-query__checkbox checkbox checkbox--gray"
                >
                  <input
                    id={`${baseId}[${value}]`}
                    type="checkbox"
                    checked={index >= 0}
                    onChange={() => updateChecked(value)}
                  />
                  <div className="checkbox__indicator" aria-hidden="true">
                    <Utility.IconComposer
                      icon="checkmark16"
                      size="default"
                      className="checkbox__icon"
                    />
                  </div>
                  {label}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}

CheckboxMixed.propTypes = {
  label: PropTypes.string.isRequired,
  checkboxes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

CheckboxMixed.displayName = "Search.Query.Form.CheckboxMixed";

export default CheckboxMixed;
