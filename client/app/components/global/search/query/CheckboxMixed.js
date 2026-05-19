import { useEffect, useRef, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Utility from "components/global/utility";

function CheckboxMixed({ label: groupLabel, checkboxes, value, onChange }) {
  const allValues = checkboxes.map(c => c.value);
  const allChecked = value.length === checkboxes.length;
  const isIndeterminate = value.length > 0 && value.length < checkboxes.length;

  const inputRef = useRef(null);
  const { t } = useTranslation();
  const id = useId();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  function toggle(key) {
    const index = value.indexOf(key);
    const next =
      index === -1
        ? [...value, key]
        : value.slice(0, index).concat(value.slice(index + 1));
    onChange(next);
  }

  function toggleAll() {
    onChange(allChecked ? [] : allValues);
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
                .map(c => `${baseId}[${c.value}]`)
                .join(" ")}
              onChange={toggleAll}
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
          {checkboxes.map(({ label, value: optionValue }) => {
            const checked = value.indexOf(optionValue) >= 0;
            return (
              <li key={optionValue}>
                <label
                  htmlFor={`${baseId}[${optionValue}]`}
                  className="search-query__checkbox checkbox checkbox--gray"
                >
                  <input
                    id={`${baseId}[${optionValue}]`}
                    type="checkbox"
                    name="facet"
                    value={optionValue}
                    checked={checked}
                    onChange={() => toggle(optionValue)}
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
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

CheckboxMixed.displayName = "Search.Query.Form.CheckboxMixed";

export default CheckboxMixed;
