import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import GlobalForm from "global/components/form";
import ConnectedFormInputs from "backend/containers/form-inputs/connected-inputs";
import List from "./HasMany/List";
import classnames from "classnames";
import isString from "lodash/isString";
import uniqueId from "lodash/uniqueId";
import Instructions from "./Instructions";
import { tagsAPI } from "api";

class FormTagList extends Component {
  static displayName = "Form.TagList";

  static propTypes = {
    focusOnMount: PropTypes.bool,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    set: PropTypes.func.isRequired,
    wide: PropTypes.bool,
    id: PropTypes.string,
    errors: PropTypes.array,
    name: PropTypes.string,
    tagScope: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    id: uniqueId("tag-list-"),
    idForError: uniqueId("tag-list-error-")
  };

  constructor() {
    super();
    this.state = { value: "" };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  get fetchOptions() {
    const options = {};
    if (this.props.tagScope) options.kind = this.props.tagScope;

    return options;
  }

  arrayEntities(value) {
    if (!value) return [];
    return isString(value) ? value.split(",").map(tag => tag.trim()) : value;
  }

  handleAdd = value => {
    if (!value) return null;
    const entities = this.arrayEntities(this.props.value);
    const name = isString(value) ? value : value.attributes.name;

    if (entities.find(entity => entity === name)) return null;
    entities.push(name);

    this.props.set(entities.join(","));
  };

  handleChange = tags => {
    this.props.set(tags.join(","));
  };

  tagLabel = tag => {
    return tag.attributes.name;
  };

  renderList(value) {
    const tags = this.arrayEntities(value);

    return (
      <List
        label={this.props.label}
        onChange={this.handleChange}
        entities={tags}
      />
    );
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames({
      "form-input": true,
      wide: this.props.wide
    });
    const id = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;
    const errorId = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={errorId}
      >
        <label htmlFor={id} className={labelClass}>
          {this.props.label}
        </label>
        <ConnectedFormInputs.PredictiveInput
          placeholder="Enter a Tag"
          fetch={tagsAPI.index}
          fetchOptions={this.fetchOptions}
          onSelect={this.handleAdd}
          onNew={this.handleAdd}
          label={this.tagLabel}
        />
        <Instructions instructions={this.props.instructions} />
        <div className="has-many-list">{this.renderList(this.props.value)}</div>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormTagList);
