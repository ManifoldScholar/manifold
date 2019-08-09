import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { UID } from "react-uid";

export default class SelectFilter extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array,
    label: PropTypes.string
  };

  get labelName() {
    return this.props.label;
  }

  get idPrefix() {
    return "filter";
  }

  render() {
    return (
      <div className={"notes-filter__select-container"}>
        <UID name={id => `${this.idPrefix}-${id}`}>
          {id => (
            <React.Fragment>
              <label htmlFor={id} className="screen-reader-text">
                {this.labelName}
              </label>
              <select id={id} className={"notes-filter__select"}>
                <option value>{this.labelName}</option>
                {this.props.options.map(option => {
                  return (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
              <Utility.IconComposer
                icon="disclosureDown16"
                size={22}
                iconClass="notes-filter__icon"
              />
            </React.Fragment>
          )}
        </UID>
      </div>
    );
  }
}
