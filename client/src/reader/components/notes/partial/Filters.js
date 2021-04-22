import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class Filters extends Component {
  static displayName = "Notes.Partial.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func,
    filter: PropTypes.object
  };

  filteredBy(filter, format) {
    return filter.indexOf(format) > -1;
  }

  toggleFormat = (event, format) => {
    event.preventDefault();
    const formatsFilter = this.props.filter.formats;
    if (this.filteredBy(formatsFilter, format)) {
      formatsFilter.splice(formatsFilter.indexOf(format), 1);
    } else {
      formatsFilter.push(format);
    }
    this.props.filterChangeHandler("formats", formatsFilter);
  };

  renderCheckBox(label, format) {
    const formats = this.props.filter.formats;
    const checked = this.filteredBy(formats, format);
    const checkboxId = format + "-checkbox";

    return (
      <label
        htmlFor={checkboxId}
        className="notes-filters__checkbox checkbox checkbox--gray"
      >
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={e => this.toggleFormat(e, format)}
        />
        <div className="checkbox__indicator" aria-hidden="true">
          <IconComposer
            icon="checkmark16"
            size="default"
            iconClass="checkbox__icon"
          />
        </div>
        {label}
      </label>
    );
  }

  render() {
    return (
      <fieldset className="notes-filters">
        <div className="notes-filters__inner">
          <legend className="notes-filters__label">Show:</legend>
          <div className="notes-filters__checkbox-group">
            {this.renderCheckBox("Highlights", "highlight")}
            {this.renderCheckBox("Annotations", "annotation")}
          </div>
        </div>
      </fieldset>
    );
  }
}
