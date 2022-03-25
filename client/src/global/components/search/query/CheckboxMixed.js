import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import Utility from "global/components/utility";

function CheckboxMixed({ label: groupLabel, checkboxes, onChange }) {
  const initialState = checkboxes.map(checkbox => checkbox.value);
  const [checked, setChecked] = useState(initialState);
  const allChecked = checked.length === checkboxes.length;

  const { t } = useTranslation();

  useEffect(() => {
    onChange(checked);
  }, [checked]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateChecked(key) {
    setChecked(prevChecked => {
      const index = prevChecked.indexOf(key);
      return index === -1
        ? [...prevChecked, key]
        : prevChecked.slice(0, index).concat(prevChecked.slice(index + 1));
    });
  }

  return (
    <UIDConsumer name={id => `search-facets-${id}`}>
      {id => (
        <fieldset className="search-query__filter-group">
          <legend className="search-query__group-label">{groupLabel}</legend>
          <div className="search-query__filter-group-list">
            <div className="search-query__checkbox-controller">
              <label
                htmlFor={`${id}[all]`}
                className="search-query__checkbox checkbox checkbox--gray"
              >
                <input
                  id={`${id}[all]`}
                  type="checkbox"
                  checked={allChecked}
                  indeterminate={`${checked.length > 0 &&
                    checked.length < checkboxes.length}`}
                  aria-controls={checkboxes
                    .map(checkbox => `${id}[${checkbox.value}]`)
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
                      htmlFor={`${id}[${value}]`}
                      className="search-query__checkbox checkbox checkbox--gray"
                    >
                      <input
                        id={`${id}[${value}]`}
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
      )}
    </UIDConsumer>
  );
}

CheckboxMixed.propTypes = {
  label: PropTypes.string.isRequired,
  checkboxes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

CheckboxMixed.displayName = "Search.Query.Form.CheckboxMixed";

export default CheckboxMixed;
