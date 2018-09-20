import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Form as FormContainer } from "containers/backend";
import { Form as GlobalForm } from "components/global";
import List from "./HasMany/List";
import Header from "./HasMany/Header";
import labelId from "helpers/labelId";
import setter from "./setter";

export class FormHasMany extends PureComponent {
  static displayName = "Form.HasMany";

  static propTypes = {
    label: PropTypes.string.isRequired,
    labelHeader: PropTypes.bool,
    onNew: PropTypes.func,
    orderable: PropTypes.bool,
    changeHandler: PropTypes.func,
    editClickHandler: PropTypes.func,
    optionsFetch: PropTypes.func.isRequired,
    entities: PropTypes.array,
    entityLabelAttribute: PropTypes.string.isRequired,
    entityAvatarAttribute: PropTypes.string,
    placeholder: PropTypes.string,
    errors: PropTypes.array,
    idForError: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    set: PropTypes.func,
    wide: PropTypes.bool
  };

  static defaultProps = {
    idForError: labelId("predictive-text-belongs-to-error-")
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

  onSelect = entity => {
    const newEntities = this.entities(this.props).slice(0);
    if (!newEntities.find(e => e.id === entity.id))
      newEntities.push(entity);

    this.onChange(newEntities, "select");
  };

  onChange = (entities, kind) => {
    if (this.props.name)
      return this.props.set(entities);
    return this.props.changeHandler(entities, kind);
  };

  entities(props) {
    if (props.name) return props.value;
    return props.entities;
  }

  entityName = entity => {
    return entity.attributes[this.props.entityLabelAttribute];
  };

  renderList(renderConditions, props) {
    if (!renderConditions) return null;

    return (
      <List
        label={props.label}
        orderable={props.orderable}
        onChange={this.onChange}
        entities={this.entities(props)}
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
        name="*"
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
          {/* Add .autofill-open to .input-autofill in order to show autofill list  */}
          <FormContainer.PredictiveInput
            className="input-predictive"
            placeholder={this.props.placeholder}
            label={this.entityName}
            onNew={this.props.onNew ? this.onNew : null}
            onSelect={this.onSelect}
            fetch={this.props.optionsFetch}
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
