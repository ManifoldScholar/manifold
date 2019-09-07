import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import withReadingGroups from "hoc/with-reading-groups";
import has from "lodash/has";

// This class is in need of refactoring. I did not have bandwidth to give it the refactor
// it deserves during reading group development --ZD

class VisibilityMenuBody extends PureComponent {
  static displayName = "ControlMenu.VisibilityMenuBody";

  static propTypes = {
    filter: PropTypes.object,
    filterChangeHandler: PropTypes.func
  };

  get readingGroups() {
    const { readingGroups } = this.props;

    return readingGroups.map(readingGroup => {
      return {
        label: readingGroup.attributes.name,
        value: readingGroup.attributes.id
      };
    });
  }

  readingGroupFilterBase(value = false) {
    /* eslint-disable no-param-reassign */
    return this.props.readingGroups.reduce((map, obj) => {
      map[obj.id] = value;
      return map;
    }, {});
    /* eslint-enable no-param-reassign */
  }

  showAll = () => {
    const filter = {
      highlight: { yours: true, others: true },
      annotation: { yours: true, others: true },
      resource: { all: true },
      readingGroups: Object.assign(this.readingGroupFilterBase(true), {
        all: false,
        private: true,
        public: true
      })
    };
    return this.props.filterChangeHandler(filter);
  };

  hideAll = () => {
    const filter = {
      highlight: { yours: false, others: false },
      annotation: { yours: false, others: false },
      resource: { all: false },
      readingGroups: Object.assign(this.readingGroupFilterBase(false), {
        all: false,
        private: false,
        public: false
      })
    };
    return this.props.filterChangeHandler(filter);
  };

  handleFilterClick = (event, group, property) => {
    const checked = event.target.checked;
    const filter = Object.assign({}, this.props.filter);
    const filterGroup = Object.assign({}, filter[group]);
    if (property === "all") {
      if (checked) {
        Object.keys(filterGroup).forEach(p => {
          filterGroup[p] = p === "all";
        });
      } else {
        filterGroup[property] = false;
      }
    } else {
      filterGroup[property] = checked;
      if (has(filterGroup, "all")) {
        filterGroup.all = false;
      }
    }
    filter[group] = filterGroup;
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
      case "reading group":
        return "readingGroup24";
      default:
        return "";
    }
  };

  renderFilter(format, label, children) {
    return (
      <li key={`visibility-${format}`} className="visibility-menu__section">
        <fieldset className="visibility-menu__group">
          <legend className="visibility-menu__legend control-menu__header control-menu__header--with-icon">
            <IconComposer
              icon={this.groupIcon(format)}
              size={32}
              iconClass="visibility-menu__group-icon"
            />
            <span className="visibility-menu__group-name">{label}</span>
          </legend>
          <div className="visibility-menu__filters control-menu__section">
            {children}
          </div>
        </fieldset>
      </li>
    );
  }

  renderReadingGroups() {
    const { readingGroups, filter } = this.props;
    if (!readingGroups) return null;
    /* eslint-disable no-param-reassign */
    const options = Object.assign(
      {},
      readingGroups.reduce((map, obj) => {
        map[obj.id] = false;
        return map;
      }, {}),
      filter.readingGroups
    );
    /* eslint-enable no-param-reassign */
    const children = readingGroups.map((readingGroup, index) => {
      return this.renderCheckbox(
        readingGroup.id,
        readingGroup.attributes.name,
        options,
        "readingGroups",
        index + 3,
        true
      );
    });
    children.unshift(
      this.renderCheckbox(
        "public",
        "My Public Annotations",
        options,
        "readingGroups",
        2,
        true
      )
    );
    children.unshift(
      this.renderCheckbox(
        "private",
        "My Private Annotations",
        options,
        "readingGroups",
        1,
        true
      )
    );
    children.unshift(
      this.renderCheckbox(
        "all",
        "All Reading Groups",
        options,
        "readingGroups",
        0,
        true
      )
    );

    return this.renderFilter("reading group", "Reading Groups", children);
  }

  renderCheckboxGroup(format, filterState, block) {
    const label = `${capitalize(format)}s`;
    return this.renderFilter(
      format,
      label,
      Object.keys(filterState).map((key, index) => {
        return this.renderCheckbox(
          key,
          capitalize(key),
          filterState,
          format,
          index,
          block
        );
      })
    );
  }

  renderCheckbox(key, label, filterState, format, index, block) {
    const checkboxId = format + "-checkbox-" + index;
    const adjustedLabel = key === "all" ? "Show All" : label;
    const checkboxClasses = classNames({
      "checkbox checkbox--white": true,
      "visibility-menu__checkbox": true,
      "visibility-menu__checkbox--block": block
    });
    return (
      <label
        htmlFor={checkboxId}
        className={checkboxClasses}
        key={`${format}-${key}`}
      >
        <input
          type="checkbox"
          id={checkboxId}
          checked={filterState[key] || false}
          onChange={event => this.handleFilterClick(event, format, key)}
        />
        <div className="checkbox__indicator" aria-hidden="true">
          <IconComposer
            icon="checkmark16"
            size="default"
            iconClass="checkbox__icon"
          />
        </div>
        {adjustedLabel}
      </label>
    );
  }

  renderFooterButtons() {
    return (
      <li className="visibility-menu__footer">
        <button onClick={this.showAll} className="control-menu__button">
          Show All
        </button>
        <button onClick={this.hideAll} className="control-menu__button">
          Hide All
        </button>
      </li>
    );
  }

  render() {
    const { filter } = this.props;
    return (
      <div className="visibility-menu control-menu">
        <div className="control-menu__header">
          <div className="control-menu__heading">{"Show the following:"}</div>
        </div>
        <ul className="visibility-menu__section-list">
          {this.renderCheckboxGroup("highlight", filter.highlight)}
          {this.renderCheckboxGroup("annotation", filter.annotation)}
          {this.renderCheckboxGroup("resource", filter.resource)}
          {this.renderReadingGroups()}
          {this.renderFooterButtons()}
        </ul>
      </div>
    );
  }
}

export default withReadingGroups(VisibilityMenuBody);
