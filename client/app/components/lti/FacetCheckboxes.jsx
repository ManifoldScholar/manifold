import { useId, useRef, useEffect } from "react";
import IconComposer from "components/global/utility/IconComposer";

export default function FacetCheckboxes({
  label,
  allLabel = "Everything",
  checkboxes,
  value,
  onChange
}) {
  const id = useId();
  const baseId = `lti-search-facets-${id}`;
  const allRef = useRef(null);

  const allValues = checkboxes.map(c => c.value);
  const allSelected =
    value.length === 0 || value.length === checkboxes.length;
  const effective = allSelected ? allValues : value;

  useEffect(() => {
    if (!allRef.current) return;
    const indeterminate =
      effective.length > 0 && effective.length < checkboxes.length;
    allRef.current.indeterminate = indeterminate;
  }, [effective, checkboxes.length]);

  function toggle(v) {
    const isOn = effective.includes(v);
    let next;
    if (isOn) {
      next = effective.filter(x => x !== v);
    } else {
      next = [...effective, v];
    }
    if (next.length === 0 || next.length === allValues.length) {
      onChange([]);
    } else {
      onChange(next);
    }
  }

  function toggleAll() {
    if (allSelected) {
      onChange([allValues[0]]);
    } else {
      onChange([]);
    }
  }

  return (
    <fieldset className="search-query__filter-group">
      <legend className="search-query__group-label">{label}</legend>
      <div className="search-query__filter-group-list">
        <div className="search-query__checkbox-controller">
          <label
            htmlFor={`${baseId}[all]`}
            className="search-query__checkbox checkbox checkbox--gray"
          >
            <input
              ref={allRef}
              id={`${baseId}[all]`}
              type="checkbox"
              checked={allSelected}
              aria-controls={checkboxes
                .map(c => `${baseId}[${c.value}]`)
                .join(" ")}
              onChange={toggleAll}
            />
            <div className="checkbox__indicator" aria-hidden="true">
              <IconComposer
                icon="checkmark16"
                size="default"
                className="checkbox__icon"
              />
            </div>
            {allLabel}
          </label>
        </div>
        <ul className="search-query__filter-group-list">
          {checkboxes.map(({ label: cbLabel, value: cbValue }) => {
            const checked = effective.includes(cbValue);
            return (
              <li key={cbValue}>
                <label
                  htmlFor={`${baseId}[${cbValue}]`}
                  className="search-query__checkbox checkbox checkbox--gray"
                >
                  <input
                    id={`${baseId}[${cbValue}]`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(cbValue)}
                  />
                  <div className="checkbox__indicator" aria-hidden="true">
                    <IconComposer
                      icon="checkmark16"
                      size="default"
                      className="checkbox__icon"
                    />
                  </div>
                  {cbLabel}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}
