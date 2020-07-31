import React, { Component } from "react";
import PropTypes from "prop-types";
import GlobalForm from "global/components/form";
import classNames from "classnames";
import IconComputed from "global/components/icon-computed";
import { UID } from "react-uid";

export default class IconPicker extends Component {
  static displayName = "ProjectCollection.Form.IconPicker";

  static propTypes = {
    projectCollection: PropTypes.object,
    name: PropTypes.string,
    errors: PropTypes.array,
    label: PropTypes.string,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool
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
        <span className="screen-reader-text">{icon}</span>
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
      "form-input icon-picker": true,
      wide: this.props.wide
    });

    return (
      <UID>
        {id => (
          <div className={inputClasses}>
            <GlobalForm.Errorable
              className="form-input"
              name={this.props.name}
              errors={this.props.errors}
              label={this.props.label}
              idForError={`${this.idForErrorPrefix}-${id}`}
            >
              <label
                className="form-input-heading"
                htmlFor={`${this.idPrefix}-${id}`}
              >
                Collection Icon:
              </label>
              <div>
                <span className="screen-reader-text">
                  Select an icon for the project collection.
                </span>
                {this.renderIconList(id)}
              </div>
            </GlobalForm.Errorable>
          </div>
        )}
      </UID>
    );
  }
}
