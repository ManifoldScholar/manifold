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

  renderIcon(icon) {
    const selected = this.selected;
    const iconClasses = classNames({
      selected: selected === icon
    });
    return (
      <li key={icon} className={iconClasses}>
        <button
          onClick={() => this.handleIconChange(icon)}
          type="button"
          aria-describedby={`collection-form-icon-${icon}`}
        >
          <IconComputed.ProjectCollection icon={icon} size={48} />
        </button>
        <span className="aria-describedby" id={`collection-form-icon-${icon}`}>
          {`Set project collection icon to ${icon}`}
        </span>
      </li>
    );
  }

  renderIconList(id) {
    return (
      <ul className="icon-row" id={`${this.idPrefix}-${id}`}>
        {this.icons.map(icon => {
          return this.renderIcon(icon);
        })}
      </ul>
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
