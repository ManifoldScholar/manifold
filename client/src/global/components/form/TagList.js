import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import Errorable from "global/components/form/Errorable";
import ConnectedFormInputs from "backend/containers/form-inputs/connected-inputs";
import List from "./HasMany/List";
import classnames from "classnames";
import isString from "lodash/isString";
import { UID } from "react-uid";
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
    errors: PropTypes.array,
    name: PropTypes.string,
    tagScope: PropTypes.string
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

  get idPrefix() {
    return "tag-list";
  }

  get idForErrorPrefix() {
    return "tag-list-error";
  }

  get idForInstructionsPrefix() {
    return "tag-list-instructions";
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

    return (
      <UID>
        {id => (
          <Errorable
            className={inputClasses}
            name={this.props.name}
            errors={this.props.errors}
            label={this.props.label}
            idForError={`${this.idForErrorPrefix}-${id}`}
          >
            <label htmlFor={`${this.idPrefix}-${id}`} className={labelClass}>
              {this.props.label}
            </label>
            <div className="has-many-list">
              <ConnectedFormInputs.PredictiveInput
                placeholder="Enter a Tag"
                fetch={tagsAPI.index}
                fetchOptions={this.fetchOptions}
                onSelect={this.handleAdd}
                onNew={this.handleAdd}
                label={this.tagLabel}
                idForError={`${this.idForErrorPrefix}-${id}`}
                idForInstructions={`${this.idForInstructionsPrefix}-${id}`}
              />
              <Instructions
                instructions={this.props.instructions}
                id={`${this.idForInstructionsPrefix}-${id}`}
              />
              {this.renderList(this.props.value)}
            </div>
          </Errorable>
        )}
      </UID>
    );
  }
}

export default setter(FormTagList);
