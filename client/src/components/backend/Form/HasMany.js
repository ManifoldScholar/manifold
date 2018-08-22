import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Form as FormContainer } from "containers/backend";
import { Form as GlobalForm } from "components/global";
import List from "./HasMany/List";
import Header from "./HasMany/Header";
import labelId from "helpers/labelId";

export default class FormHasMany extends PureComponent {
  static displayName = "Form.HasMany";

  static propTypes = {
    label: PropTypes.string.isRequired,
    labelHeader: PropTypes.bool,
    onNew: PropTypes.func,
    orderable: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    editClickHandler: PropTypes.func,
    optionsFetch: PropTypes.func.isRequired,
    entities: PropTypes.array.isRequired,
    entityLabelAttribute: PropTypes.string.isRequired,
    entityAvatarAttribute: PropTypes.string,
    placeholder: PropTypes.string,
    errors: PropTypes.array,
    idForError: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    wide: PropTypes.bool
  };

  static defaultProps = {
    idForError: labelId("predictive-text-belongs-to-error-")
  };

  onNew = value => {
    if (!this.props.onNew) return null;
    this.props.onNew(value).then(newEntity => {
      const newEntities = this.props.entities.slice(0);
      const newRelationship = {
        type: newEntity.data.type,
        id: newEntity.data.id
      };
      newEntities.push(newRelationship);
      this.props.onChange(newEntities, "select");
    });
  };

  onSelect = entity => {
    const newEntities = this.props.entities.slice(0);
    newEntities.push(entity);
    this.props.onChange(newEntities, "select");
  };

  entityName = entity => {
    return entity.attributes[this.props.entityLabelAttribute];
  };

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
          <List
            label={this.props.label}
            orderable={this.props.orderable}
            onChange={this.props.onChange}
            entities={this.props.entities}
            entityName={this.entityName}
            editClickHandler={this.props.editClickHandler}
            entityAvatarAttribute={this.props.entityAvatarAttribute}
          />
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
        </nav>
      </GlobalForm.Errorable>
    );
  }
}
