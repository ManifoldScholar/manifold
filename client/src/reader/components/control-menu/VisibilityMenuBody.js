import React from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import classNames from "classnames";
import has from "lodash/has";
import IconComposer from "components/global/utility/IconComposer";
import { useTranslation } from "react-i18next";
import { useAuthentication, useReadingGroups, useLoaderEntity } from "hooks";

function VisibilityMenuBody({ filter, filterChangeHandler, className }) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const text = useLoaderEntity("texts");
  const { readingGroups } = useReadingGroups();

  const canEngagePublicly = text?.attributes?.abilities?.engagePublicly;
  const canAccessReadingGroups =
    currentUser?.attributes?.classAbilities?.readingGroup?.read;

  function readingGroupFilterBase(value = false) {
    return readingGroups.reduce(
      (map, obj) => ({ ...map, [obj.id]: value }),
      {}
    );
  }

  function showAll() {
    filterChangeHandler({
      annotation: { yours: true, others: true, highlights: true },
      resource: { all: true },
      readingGroups: Object.assign(readingGroupFilterBase(false), {
        all: true,
        private: false,
        public: false
      })
    });
  }

  function hideAll() {
    filterChangeHandler({
      annotation: { yours: false, others: false, highlights: false },
      resource: { all: false },
      readingGroups: Object.assign(readingGroupFilterBase(false), {
        all: false,
        private: false,
        public: false
      })
    });
  }

  function handleFilterClick(event, group, property) {
    const checked = event.target.checked;
    const newFilter = { ...filter };
    const filterGroup = { ...newFilter[group] };
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
    newFilter[group] = filterGroup;
    filterChangeHandler(newFilter);
  }

  function groupIcon(format) {
    switch (format) {
      case "annotation":
        return "comment24";
      case "resource":
        return "resource24";
      case "reading-group":
        return "readingGroup24";
      default:
        return "";
    }
  }

  function showAllPressed(filters) {
    const { annotation, readingGroups: rg, resource } = filters ?? {};
    if (!annotation || !rg || !resource) return false;
    if (Object.values(annotation).some(val => !val)) return false;
    if (Object.values(resource).some(val => !val)) return false;
    if (!rg?.all) return false;
    return true;
  }

  function hideAllPressed(filters) {
    const { annotation, readingGroups: rg, resource } = filters ?? {};
    if (!annotation || !rg || !resource) return false;
    if (Object.values(annotation).some(val => val)) return false;
    if (Object.values(resource).some(val => val)) return false;
    if (Object.values(rg).some(val => val)) return false;
    return true;
  }

  function renderCheckbox(key, label, filterState, format, index, flex) {
    const checkboxId = format + "-checkbox-" + index;
    let adjustedLabel = label;
    if (key === "all") adjustedLabel = t("actions.show_all");
    else if (key === "highlights")
      adjustedLabel = t("reader.menus.visibility.highlights_label");
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
          onChange={event => handleFilterClick(event, format, key)}
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

  function renderFilter(format, label, children) {
    const flex = format !== "reading-group" && format !== "annotation";
    const ListTag = children?.length > 1 ? "ul" : "div";
    const ItemTag = children?.length > 1 ? "li" : React.Fragment;
    return (
      <div key={`visibility-${format}`} className="visibility-menu__section">
        <fieldset className="visibility-menu__group">
          <legend className="visibility-menu__legend control-menu__header control-menu__header--with-icon">
            <IconComposer
              icon={groupIcon(format)}
              size={32}
              className="visibility-menu__group-icon"
            />
            <span className="visibility-menu__group-name">{label}</span>
          </legend>
          <ListTag
            className={classNames(
              "visibility-menu__filters control-menu__section",
              { "visibility-menu__filters--flex": flex }
            )}
          >
            {React.Children.map(children, child => (
              <ItemTag>{child}</ItemTag>
            ))}
          </ListTag>
        </fieldset>
      </div>
    );
  }

  function renderCheckboxGroup(format, filterState = {}, flex) {
    let label;
    switch (format) {
      case "annotation":
        label = t("glossary.annotation_title_case_other");
        break;
      case "highlight":
        label = t("glossary.highlight_title_case_other");
        break;
      case "resource":
        label = t("glossary.resource_title_case_other");
        break;
      default:
        label = "";
    }
    return renderFilter(
      format,
      label,
      Object.keys(filterState).map((key, index) => {
        return renderCheckbox(
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

  function renderReadingGroups() {
    if (!readingGroups) return null;
    const options = {
      ...readingGroups.reduce((map, obj) => ({ ...map, [obj.id]: false }), {}),
      ...filter.readingGroups
    };
    const children = readingGroups.map((readingGroup, index) => {
      return renderCheckbox(
        readingGroup.id,
        readingGroup.attributes.name,
        options,
        "readingGroups",
        index + 3,
        true
      );
    });
    if (canEngagePublicly)
      children.unshift(
        renderCheckbox(
          "public",
          t("reader.my_public_annotations"),
          options,
          "readingGroups",
          2,
          true
        )
      );
    children.unshift(
      renderCheckbox(
        "private",
        t("reader.my_private_annotations"),
        options,
        "readingGroups",
        1,
        true
      )
    );
    children.unshift(
      renderCheckbox(
        "all",
        t("reader.menus.visibility.all_reading_groups"),
        options,
        "readingGroups",
        0,
        true
      )
    );

    const label = canAccessReadingGroups
      ? t("glossary.reading_group_title_case_other")
      : t("common.visibility_title_case");
    return renderFilter("reading-group", label, children);
  }

  function renderFooterButtons(filters) {
    return (
      <div className="visibility-menu__footer">
        <button
          onClick={showAll}
          className="control-menu__button"
          aria-pressed={showAllPressed(filters)}
        >
          {t("actions.show_all")}
        </button>
        <button
          onClick={hideAll}
          className="control-menu__button"
          aria-pressed={hideAllPressed(filters)}
        >
          {t("actions.hide_all")}
        </button>
      </div>
    );
  }

  return (
    <div
      className={classNames("visibility-menu control-menu", {
        [className]: !!className
      })}
    >
      <div className="control-menu__header">
        <h2 className="control-menu__heading">
          {t("reader.menus.visibility.show_the_following")}
        </h2>
      </div>
      <div className="visibility-menu__section-list">
        {renderCheckboxGroup("annotation", filter.annotation, true)}
        {renderCheckboxGroup("resource", filter.resource)}
        {(canAccessReadingGroups || canEngagePublicly) && renderReadingGroups()}
        {renderFooterButtons(filter)}
      </div>
    </div>
  );
}

VisibilityMenuBody.displayName = "ControlMenu.VisibilityMenuBody";

VisibilityMenuBody.propTypes = {
  filter: PropTypes.object,
  filterChangeHandler: PropTypes.func,
  className: PropTypes.string
};

export default VisibilityMenuBody;
