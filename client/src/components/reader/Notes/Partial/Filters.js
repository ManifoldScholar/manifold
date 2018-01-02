import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Filters extends Component {
  static displayName = "Notes.List.Filters";

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

    return (
      <label className="checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => this.toggleFormat(e, format)}
        />
        <div className="control-indicator">
          <i className="manicon manicon-check" />
        </div>
        {label}
      </label>
    );
  }

  render() {
    return (
      <nav className="filters">
        <label className="label">Show your:</label>
        <div className="checkbox-group">
          {this.renderCheckBox("Highlights", "highlight")}
          {this.renderCheckBox("Annotations", "annotation")}
        </div>
      </nav>
    );
  }
}
