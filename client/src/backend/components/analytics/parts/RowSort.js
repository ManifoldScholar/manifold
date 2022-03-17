import React from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";

function RowSort({ options, active, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="analytics-block__sort">
      <form
        onSubmit={event => event.preventDefault()}
        className="analytics-block__sort-form"
      >
        <UIDConsumer name={id => `rowSort-${id}`}>
          {id => (
            <div className="select">
              <label htmlFor={id} className="select__label">
                {t("backend.analytics.sort_by")}
              </label>
              <div className="select__wrapper">
                <select
                  id={id}
                  onChange={event => onChange(event.target.value)}
                  value={active.value}
                >
                  {options.map(({ key, value, label }) => (
                    <option key={key} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Utility.IconComposer icon="disclosureDown16" size={22} />
              </div>
            </div>
          )}
        </UIDConsumer>
      </form>
    </div>
  );
}

RowSort.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired),
  active: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

RowSort.displayName = "Analytics.Block.Table.Sort";

export default RowSort;
