import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class SelectFilter extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array,
    label: PropTypes.string
  };

  get labelName() {
    return this.props.label;
  }

  render() {
    return (
      <div className={"notes-filter__select-container"}>
        <select className={"notes-filter__select"}>
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
      </div>
    );
  }
}
