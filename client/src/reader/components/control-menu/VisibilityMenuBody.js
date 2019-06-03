import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import IconComposer from "global/components/utility/IconComposer";

export default class VisibilityMenuBody extends PureComponent {
  static displayName = "ControlMenu.VisibilityMenuBody";

  static propTypes = {
    filter: PropTypes.object,
    filterChangeHandler: PropTypes.func
  };

  handleFilterClick = (key, label) => {
    if (!key) return null;
    const filter = Object.assign({}, this.props.filter);

    if (label) {
      filter[key][label] = !filter[key][label];
    } else {
      filter[key] = !filter[key];
    }

    return this.props.filterChangeHandler(filter);
  };

  groupIcon = format => {
    switch (format) {
      case "annotation":
        return "comment24";
      case "highlight":
        return "annotate24";
      case "resource":
        return "resource24";
      default:
        return "";
    }
  };

  renderCheckboxGroup(format, filterState) {
    const label = `${capitalize(format)}s`;

    return (
      <li key={`visibility-${format}`}>
        <IconComposer
          icon={this.groupIcon(format)}
          size={30.667}
          iconClass="visibility-menu__group-icon"
        />
        <span>{label}</span>
        <div className="filters">
          {Object.keys(filterState).map((key, index) => {
            return this.renderCheckbox(key, filterState, format, index);
          })}
        </div>
      </li>
    );
  }

  renderCheckbox(key, filterState, format, index) {
    let label = capitalize(key);
    const checkboxId = format + "-checkbox-" + index;
    if (key === "all") label = "Show All";

    return (
      <label htmlFor={checkboxId} className="checkbox" key={`${format}-${key}`}>
        <input
          type="checkbox"
          id={checkboxId}
          checked={filterState[key]}
          onChange={() => this.handleFilterClick(format, key)}
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
    const { filter } = this.props;
    return (
      <nav className="visibility-menu">
        <ul>
          {Object.keys(filter).map(format => {
            return this.renderCheckboxGroup(format, filter[format]);
          })}
        </ul>
      </nav>
    );
  }
}
