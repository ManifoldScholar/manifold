import React from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

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
            <div>
              <Styled.Label htmlFor={id}>{t("analytics.sort_by")}</Styled.Label>
              <Styled.SelectWrapper>
                <Styled.Select
                  id={id}
                  onChange={event => onChange(event.target.value)}
                  value={active.value}
                >
                  {options.map(({ key, value, label }) => (
                    <option key={key} value={value}>
                      {label}
                    </option>
                  ))}
                </Styled.Select>
                <Styled.Icon icon="disclosureDown16" size={22} />
              </Styled.SelectWrapper>
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
