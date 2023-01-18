import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import classNames from "classnames";
import IconComputed from "global/components/icon-computed";
import { UIDConsumer } from "react-uid";
import { withTranslation } from "react-i18next";

class IconPicker extends Component {
  static displayName = "ProjectCollection.Form.IconPicker";

  static propTypes = {
    projectCollection: PropTypes.object,
    name: PropTypes.string,
    errors: PropTypes.array,
    label: PropTypes.string,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    name: "attributes[icon]"
  };

  get selected() {
    return this.props.getModelValue("attributes[icon]");
  }

  get icons() {
    return [
      "book-stack-vertical",
      "lamp",
      "new-round",
      "books-on-shelf",
      "globe",
      "touch",
      "mug"
    ];
  }

  screenreader = icon => {
    const t = this.props.t;
    switch (icon) {
      case "book-stack-vertical":
        return t("project_collections.book_stack_icon");
      case "lamp":
        return t("project_collections.lamp_icon");
      case "new-round":
        return t("project_collections.new_icon");
      case "books-on-shelf":
        return t("project_collections.book_shelf_icon");
      case "globe":
        return t("project_collections.globe_icon");
      case "touch":
        return t("project_collections.touch_icon");
      case "mug":
        return t("project_collections.mug_icon");
      default:
        return null;
    }
  };

  get idPrefix() {
    return "icon-picker";
  }

  get idForErrorPrefix() {
    return "icon-picker";
  }

  handleIconChange = icon => {
    this.props.setOther(icon, "attributes[icon]");
  };

  maybeClear = icon => {
    if (this.selected === icon) {
      this.props.setOther(null, "attributes[icon]");
      document.activeElement.blur();
    }
  };

  renderIcon(icon, id) {
    const selected = this.selected === icon;
    const labelClasses = classNames({
      "icon-picker__item": true,
      "icon-picker__item--active": selected
    });
    return (
      <label key={icon} className={labelClasses}>
        <span className="screen-reader-text">{this.screenreader(icon)}</span>
        <input
          type="radio"
          value={icon}
          name={`${this.idPrefix}-${id}`}
          checked={selected}
          onClick={() => this.maybeClear(icon)}
          onChange={() => this.handleIconChange(icon)}
          className="icon-picker__input"
        />
        <IconComputed.ProjectCollection icon={icon} size={48} />
      </label>
    );
  }

  renderIconList(id) {
    return (
      <div
        role="group"
        id={`${this.idPrefix}-${id}`}
        className="icon-picker__list"
      >
        {this.icons.map(icon => {
          return this.renderIcon(icon, id);
        })}
      </div>
    );
  }

  render() {
    const inputClasses = classNames({
      "icon-picker": true,
      wide: this.props.wide
    });

    return (
      <UIDConsumer>
        {id => (
          <div className={inputClasses}>
            <GlobalForm.Errorable
              name={this.props.name}
              errors={this.props.errors}
              label={this.props.label}
              idForError={`${this.idForErrorPrefix}-${id}`}
            >
              <GlobalForm.Label
                htmlFor={`${this.idPrefix}-${id}`}
                label={this.props.t("project_collections.collection_icon")}
              />
              <div>
                <span className="screen-reader-text">
                  {this.props.t(
                    "project_collections.collection_icon_instructions"
                  )}
                </span>
                {this.renderIconList(id)}
              </div>
            </GlobalForm.Errorable>
          </div>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(IconPicker);
