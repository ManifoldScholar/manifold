import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

import { withTranslation } from "react-i18next";

class Filters extends Component {
  static displayName = "Notes.Partial.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func,
    filters: PropTypes.object,
    t: PropTypes.func
  };

  filteredBy(filter, format) {
    return filter.indexOf(format) > -1;
  }

  toggleFormat = (event, format) => {
    event.preventDefault();
    const formatsFilter = this.props.filters.formats;
    if (this.filteredBy(formatsFilter, format)) {
      formatsFilter.splice(formatsFilter.indexOf(format), 1);
    } else {
      formatsFilter.push(format);
    }
    this.props.filterChangeHandler({ formats: formatsFilter });
  };

  renderCheckBox(label, format) {
    const formats = this.props.filters.formats;
    const checked = this.filteredBy(formats, format);
    const checkboxId = format + "-checkbox";

    return (
      <label
        htmlFor={checkboxId}
        className="notes-filters__checkbox checkbox checkbox--white"
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
            className="checkbox__icon"
          />
        </div>
        {label}
      </label>
    );
  }

  render() {
    return (
      <fieldset className="notes-filters">
        <legend className="notes-filters__legend">
          {this.props.t("actions.show") + ":"}
        </legend>
        <div className="notes-filters__checkbox-group">
          {this.renderCheckBox(
            this.props.t("glossary.highlight_title_case_other"),
            "highlight"
          )}
          {this.renderCheckBox(
            this.props.t("glossary.annotation_title_case_other"),
            "annotation"
          )}
        </div>
      </fieldset>
    );
  }
}

export default withTranslation()(Filters);
