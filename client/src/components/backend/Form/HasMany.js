import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { Form as FormContainer } from 'containers/backend';
import { Form as GlobalForm } from 'components/global';
import indexOf from 'lodash/indexOf';

export default class Makers extends PureComponent {

  static displayName = "Form.HasMany";

  static propTypes = {
    label: PropTypes.string.isRequired,
    onNew: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    optionsFetch: PropTypes.func.isRequired,
    entities: PropTypes.array.isRequired,
    entityLabelAttribute: PropTypes.string.isRequired,
    entityAvatarAttribute: PropTypes.string,
    errors: PropTypes.array
  };

  constructor() {
    super();
    this.onNew = this.onNew.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  onMove(event, entity, direction) {
    event.preventDefault();
    const newEntities = this.props.entities.slice(0);
    const index = indexOf(newEntities, entity);
    let target = direction === "up" ? index - 1 : index + 1;
    if (target < 0) target = 0;
    if (target > newEntities.length) target = newEntities.length;
    const tmp = newEntities[target];
    newEntities[target] = entity;
    newEntities[index] = tmp;
    this.props.onChange(newEntities, "move");
  }

  onNew(value) {
    this.props.onNew(value).then((newEntity) => {
      const newEntities = this.props.entities.slice(0);
      const newRelationship = {
        type: newEntity.data.type,
        id: newEntity.data.id
      };
      newEntities.push(newRelationship);
      this.props.onChange(newEntities, "select");
    });
  }

  onSelect(entity) {
    const newEntities = this.props.entities.slice(0);
    newEntities.push(entity);
    this.props.onChange(newEntities, "select");
  }

  onRemove(entity, event) {
    event.preventDefault();
    const newEntities = this.props.entities.filter((compare) => {
      return compare !== entity;
    });
    this.props.onChange(newEntities, "remove");
  }

  label(entity, props) {
    return entity.attributes[props.entityLabelAttribute];
  }

  renderOrderButton(direction, ordinal, entity) {
    let output = null;

    const buttonClass = classNames({
      manicon: true,
      'manicon-arrow-up': direction === 'up',
      'manicon-arrow-down': direction === 'down'
    });
    if (direction === 'up' && ordinal !== 0
        || direction === 'down' && ordinal !== this.props.entities.length - 1) {
      // Avatar can be moved up, output up button
      output = (
        <button
          onClick={(event) => { this.onMove(event, entity, direction); }}
          className={buttonClass}
        >
          <span className="screen-reader-text">
            Click to move {this.label(entity, this.props)} up in the order of makers.
          </span>
        </button>
      );
    }
    return output;
  }

  render() {
    const entities = this.props.entities;

    return (
      <GlobalForm.Errorable
        className="form-input"
        name="*"
        errors={this.props.errors}
        label={this.props.label}
      >
        <label>{this.props.label}</label>
        <nav className="has-many-list">
          <ul>
            {entities.map((entity, index) => {
              return (
                <li key={index} >
                  <div className="association">
                    { this.props.entityAvatarAttribute ?
                      <figure>
                        { entity.attributes[this.props.entityAvatarAttribute] ?
                          <img
                            src={entity.attributes[this.props.entityAvatarAttribute]}
                          /> :
                          <div className="no-image">
                            <i className="manicon manicon-person"></i>
                          </div>
                        }
                      </figure>
                    : null}
                    <h4 className="association-name">
                      {this.label(entity, this.props)}
                    </h4>
                  </div>

                  <div className="utility">
                    {this.renderOrderButton('up', index, entity)}
                    {this.renderOrderButton('down', index, entity)}
                    <button
                      onClick={(event) => { this.onRemove(entity, event); }}
                      className="manicon manicon-x"
                    >
                      <span className="screen-reader-text">
                        Click to remove {this.label(entity, this.props)}
                        from the makers list.
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {/* Add .autofill-open to .input-autofill in order to show autofill list  */}
          <FormContainer.PredictiveInput
            className="input-predictive"
            placeholder="Add an Author"
            label={
              (option) => {
                return `${option.attributes.firstName} ${option.attributes.lastName}`;
              }
            }
            onNew={this.onNew}
            onSelect={this.onSelect}
            fetch={this.props.optionsFetch}
          />
        </nav>
      </GlobalForm.Errorable>
    );
  }

}
