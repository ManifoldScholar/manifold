import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";

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

  iconClasses = format => {
    switch (format) {
      case "annotation":
        return "manicon manicon-word-bubble";
      case "highlight":
        return "manicon manicon-pencil-simple";
      case "resource":
        return "manicon manicon-cube-outline";
      default:
        return "";
    }
  };

  renderCheckboxGroup(format, filterState) {
    const label = `${capitalize(format)}s`;

    return (
      <li key={`visibility-${format}`}>
        <i className={this.iconClasses(format)} />
        <span>
          {label}
        </span>
        <div className="filters">
          {Object.keys(filterState).map(key => {
            return this.renderCheckbox(key, filterState, format);
          })}
        </div>
      </li>
    );
  }

  renderCheckbox(key, filterState, format) {
    let label = capitalize(key);
    if (key === "all") label = "Show All";

    return (
      <label className="checkbox" key={`${format}-${key}`}>
        <input
          type="checkbox"
          checked={filterState[key]}
          onChange={() => this.handleFilterClick(format, key)}
        />
        <div className="control-indicator">
          <i className="manicon manicon-check" />
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
