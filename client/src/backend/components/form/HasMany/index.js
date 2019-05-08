import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import GlobalForm from "global/components/form";
import labelId from "helpers/labelId";
import isArray from "lodash/isArray";
import List from "./List";
import Header from "./Header";
import setter from "../setter";
import OptionsList from "../OptionsList";

export class FormHasMany extends PureComponent {
  static defaultProps = {
    idForError: labelId("predictive-text-belongs-to-error-"),
    searchable: true,
    emptyMessage: "None Added"
  };

  static displayName = "Form.HasMany";

  static propTypes = {
    label: PropTypes.string.isRequired,
    labelHeader: PropTypes.bool,
    emptyMessage: PropTypes.string,
    onNew: PropTypes.func,
    orderable: PropTypes.bool,
    changeHandler: PropTypes.func,
    editClickHandler: PropTypes.func,
    fetch: PropTypes.func,
    fetchOptions: PropTypes.object,
    options: PropTypes.array,
    entities: PropTypes.array,
    entityLabelAttribute: PropTypes.string.isRequired,
    entityAvatarAttribute: PropTypes.string,
    placeholder: PropTypes.string,
    errors: PropTypes.array,
    idForError: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    set: PropTypes.func,
    name: PropTypes.string,
    searchable: PropTypes.bool,
    wide: PropTypes.bool,
    value: PropTypes.any
  };

  onChange = (entities, kind) => {
    if (this.props.name) return this.props.set(entities);
    return this.props.changeHandler(entities, kind);
  };

  onNew = value => {
    if (!this.props.onNew || !this.props.changeHandler) return null;
    this.props.onNew(value).then(newEntity => {
      const newEntities = this.props.entities.slice(0);
      const newRelationship = {
        type: newEntity.data.type,
        id: newEntity.data.id
      };
      newEntities.push(newRelationship);
      this.props.changeHandler(newEntities, "select");
    });
  };

  onSelect = entityOrEntities => {
    if (isArray(entityOrEntities)) return this.selectMany(entityOrEntities);
    return this.selectOne(entityOrEntities);
  };

  get entities() {
    const entities = this.props.name ? this.props.value : this.props.entities;
    return entities || [];
  }

  entityName = entity => {
    return entity.attributes[this.props.entityLabelAttribute];
  };

  selectMany(entities) {
    this.onChange(entities, "select");
  }

  selectOne(entity) {
    const newEntities = this.entities.slice(0);
    if (!newEntities.find(e => e.id === entity.id)) newEntities.push(entity);

    this.onChange(newEntities, "select");
  }

  renderList(renderConditions, props) {
    if (!renderConditions) return null;

    return (
      <List
        label={props.label}
        emptyMessage={props.emptyMessage}
        orderable={props.orderable}
        onChange={this.onChange}
        entities={this.entities}
        entityName={this.entityName}
        editClickHandler={props.editClickHandler}
        entityAvatarAttribute={props.entityAvatarAttribute}
      />
    );
  }

  render() {
    const inputClasses = classNames({
      "form-input": true,
      wide: this.props.wide
    });

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={this.props.idForError}
      >
        <Header
          label={this.props.label}
          labelHeader={this.props.labelHeader}
          instructions={this.props.instructions}
        />
        <nav className="has-many-list">
          {this.renderList(
            this.props.orderable || this.props.editClickHandler,
            this.props
          )}
          <OptionsList
            placeholder={this.props.placeholder}
            label={this.entityName}
            onNew={this.props.onNew ? this.onNew : null}
            onSelect={this.onSelect}
            fetch={this.props.fetch}
            fetchOptions={this.props.fetchOptions}
            options={this.props.options}
            searchable={this.props.searchable}
            idForError={this.props.idForError}
          />
          {this.renderList(
            !this.props.orderable && !this.props.editClickHandler,
            this.props
          )}
        </nav>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormHasMany);
