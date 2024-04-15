import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import withReadingGroups from "hoc/withReadingGroups";
import has from "lodash/has";
import { ReaderContext } from "helpers/contexts";
import withCurrentUser from "hoc/withCurrentUser";
import { withTranslation } from "react-i18next";

// This class is in need of refactoring. I did not have bandwidth to give it the refactor
// it deserves during reading group development --ZD

class VisibilityMenuBody extends PureComponent {
  static displayName = "ControlMenu.VisibilityMenuBody";

  static propTypes = {
    filter: PropTypes.object,
    filterChangeHandler: PropTypes.func,
    t: PropTypes.func
  };

  static contextType = ReaderContext;

  get readingGroups() {
    const { readingGroups } = this.props;

    return readingGroups.map(readingGroup => {
      return {
        label: readingGroup.attributes.name,
        value: readingGroup.attributes.id
      };
    });
  }

  get canEngagePublicly() {
    return this.context.attributes.abilities.engagePublicly;
  }

  get canAccessReadingGroups() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
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
      readingGroups: Object.assign(this.readingGroupFilterBase(false), {
        all: true,
        private: false,
        public: false
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
    const filter = { ...this.props.filter };
    const filterGroup = { ...filter[group] };
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
      case "reading-group":
        return "readingGroup24";
      default:
        return "";
    }
  };

  renderFilter(format, label, children) {
    const flex = format !== "reading-group";
    return (
      <li key={`visibility-${format}`} className="visibility-menu__section">
        <fieldset className="visibility-menu__group">
          <legend className="visibility-menu__legend control-menu__header control-menu__header--with-icon">
            <IconComposer
              icon={this.groupIcon(format)}
              size={32}
              className="visibility-menu__group-icon"
            />
            <span className="visibility-menu__group-name">{label}</span>
          </legend>
          <div
            className={classNames(
              "visibility-menu__filters control-menu__section",
              { "visibility-menu__filters--flex": flex }
            )}
          >
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
    const options = {
      ...readingGroups.reduce((map, obj) => {
        map[obj.id] = false;
        return map;
      }, {}),
      ...filter.readingGroups
    };
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
    if (this.canEngagePublicly)
      children.unshift(
        this.renderCheckbox(
          "public",
          this.props.t("reader.my_public_annotations"),
          options,
          "readingGroups",
          2,
          true
        )
      );
    children.unshift(
      this.renderCheckbox(
        "private",
        this.props.t("reader.my_private_annotations"),
        options,
        "readingGroups",
        1,
        true
      )
    );
    children.unshift(
      this.renderCheckbox(
        "all",
        this.props.t("reader.menus.visibility.all_reading_groups"),
        options,
        "readingGroups",
        0,
        true
      )
    );

    const label = this.canAccessReadingGroups
      ? this.props.t("glossary.reading_group_title_case_other")
      : this.props.t("common.visibility_title_case");
    return this.renderFilter("reading-group", label, children);
  }

  renderCheckboxGroup(format, filterState = {}, flex) {
    let label;
    switch (format) {
      case "annotation":
        label = this.props.t("glossary.annotation_title_case_other");
        break;
      case "highlight":
        label = this.props.t("glossary.highlight_title_case_other");
        break;
      case "resource":
        label = this.props.t("glossary.resource_title_case_other");
        break;
      default:
        label = "";
    }
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
          flex
        );
      })
    );
  }

  renderCheckbox(key, label, filterState, format, index, flex) {
    const checkboxId = format + "-checkbox-" + index;
    const adjustedLabel =
      key === "all" ? this.props.t("actions.show_all") : label;
    const checkboxClasses = classNames({
      "checkbox checkbox--white": true,
      "visibility-menu__checkbox": true,
      "visibility-menu__checkbox--flex": flex
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
            className="checkbox__icon"
          />
        </div>
        <span>{adjustedLabel}</span>
      </label>
    );
  }

  showAllPressed(filters) {
    const { annotation, highlight, readingGroups, resource } = filters ?? {};
    if (!annotation || !highlight || !readingGroups || !resource) return false;
    if (Object.values(annotation).some(val => !val)) return false;
    if (Object.values(highlight).some(val => !val)) return false;
    if (Object.values(resource).some(val => !val)) return false;
    if (!readingGroups?.all) return false;
    return true;
  }

  hideAllPressed(filters) {
    const { annotation, highlight, readingGroups, resource } = filters ?? {};
    if (!annotation || !highlight || !readingGroups || !resource) return false;
    if (Object.values(annotation).some(val => val)) return false;
    if (Object.values(highlight).some(val => val)) return false;
    if (Object.values(resource).some(val => val)) return false;
    if (Object.values(readingGroups).some(val => val)) return false;
    return true;
  }

  renderFooterButtons(filters) {
    return (
      <li className="visibility-menu__footer">
        <button
          onClick={this.showAll}
          className="control-menu__button"
          aria-pressed={this.showAllPressed(filters)}
        >
          {this.props.t("actions.show_all")}
        </button>
        <button
          onClick={this.hideAll}
          className="control-menu__button"
          aria-pressed={this.hideAllPressed(filters)}
        >
          {this.props.t("actions.hide_all")}
        </button>
      </li>
    );
  }

  render() {
    const { filter } = this.props;
    return (
      <div className="visibility-menu control-menu">
        <div className="control-menu__header">
          <h2 className="control-menu__heading">
            {this.props.t("reader.menus.visibility.show_the_following")}
          </h2>
        </div>
        <ul className="visibility-menu__section-list">
          {this.renderCheckboxGroup("highlight", filter.highlight)}
          {this.renderCheckboxGroup("annotation", filter.annotation)}
          {this.renderCheckboxGroup("resource", filter.resource)}
          {(this.canAccessReadingGroups || this.canEngagePublicly) &&
            this.renderReadingGroups()}
          {this.renderFooterButtons(filter)}
        </ul>
      </div>
    );
  }
}

export default withTranslation()(
  withReadingGroups(withCurrentUser(VisibilityMenuBody))
);
