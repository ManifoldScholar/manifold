import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { UID } from "react-uid";

export default class AnnotationNoteFilterFilter extends React.PureComponent {
  static displayName = "Annotation.NoteFilter.Filter";

  static propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    allOption: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
  };

  get labelName() {
    return this.props.label;
  }

  get idPrefix() {
    return "filter";
  }

  get allOption() {
    return this.props.allOption;
  }

  render() {
    return (
      <div className={"notes-filter__select-container"}>
        <UID name={id => `${this.idPrefix}-${id}`}>
          {id => (
            <>
              <label htmlFor={id} className="screen-reader-text">
                {this.labelName}
              </label>
              <select
                id={id}
                value={this.props.value}
                onChange={this.props.onChange}
                className={"notes-filter__select"}
              >
                <option value={this.allOption.value}>
                  {this.allOption.label}
                </option>
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
            </>
          )}
        </UID>
      </div>
    );
  }
}
