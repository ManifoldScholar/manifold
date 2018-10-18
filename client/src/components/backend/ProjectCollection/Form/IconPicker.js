import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form as GlobalForm } from "components/global";
import setter from "components/backend/Form/setter";
import classNames from "classnames";
import { Utility } from "components/global";
import labelId from "helpers/labelId";

class IconPicker extends Component {
  static displayName = "ProjectCollection.Form.IconPicker";

  static propTypes = {
    projectCollection: PropTypes.object,
    name: PropTypes.string,
    errors: PropTypes.array,
    label: PropTypes.string,
    idForError: PropTypes.string,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool
  };

  static defaultProps = {
    name: "attributes[icon]",
    idForError: labelId("textarea-error-")
  };

  selected() {
    return this.props.getModelValue("attributes[icon]");
  }

  icons() {
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

  handleIconChange = icon => {
    this.props.setOther(icon, "attributes[icon]");
  };

  renderIcon(icon) {
    const selected = this.selected();
    const iconClasses = classNames({
      manicon: true,
      selected: selected === icon
    });
    return (
      <li key={icon} className={iconClasses}>
        <div
          onClick={() => this.handleIconChange(icon)}
          role="radio"
          tabIndex="0"
          aria-checked={selected === icon}
        >
          <Utility.IconComposer icon={icon} size={48} />
        </div>
      </li>
    );
  }

  renderIconList() {
    return (
      <ul role="radiogroup" className="icon-row">
        {this.icons().map(icon => {
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
      <div className={inputClasses}>
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
          idForError={this.props.idForError}
        >
          <h4 className="form-input-heading">Collection Icon:</h4>
          <div>
            <span className="screen-reader-text">
              Select an icon for the project collection.
            </span>
            {this.renderIconList()}
          </div>
        </GlobalForm.Errorable>
      </div>
    );
  }
}

export default setter(IconPicker);
