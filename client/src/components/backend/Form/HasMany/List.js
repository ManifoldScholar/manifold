import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import indexOf from "lodash/indexOf";
import ListItem from "./ListItem";
import isString from "lodash/isString";
import classnames from "classnames";

export default class FormHasManyList extends PureComponent {
  static displayName = "Form.HasMany.List";

  static propTypes = {
    label: PropTypes.string.isRequired,
    orderable: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    editClickHandler: PropTypes.func,
    entityName: PropTypes.func,
    entities: PropTypes.array.isRequired,
    entityAvatarAttribute: PropTypes.string
  };

  static defaultProps = {
    entityName: name => name
  };

  onMove = (event, entity, direction) => {
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
  };

  onRemove = (event, entity) => {
    event.preventDefault();
    const newEntities = this.props.entities.filter(compare => {
      return compare !== entity;
    });
    this.props.onChange(newEntities, "remove");
  };

  maybeRenderPlaceholder(renderConditions, label) {
    if (!renderConditions) return null;

    return <div className="placeholder">No {label} added</div>;
  }

  render() {
    const { orderable, editClickHandler, entities } = this.props;
    const hasEntities = entities.length > 0;
    const bucketStyle = !orderable && !editClickHandler;

    const listClasses = classnames({
      bucket: bucketStyle,
      empty: bucketStyle && !hasEntities
    });

    return (
      <ul className={listClasses}>
        {hasEntities
          ? entities.map((entity, index) => {
              const key = isString(entity) ? entity : entity.id;

              return (
                <ListItem
                  key={key}
                  entity={entity}
                  entities={entities}
                  ordinal={index}
                  entityName={this.props.entityName}
                  entityAvatarAttribute={this.props.entityAvatarAttribute}
                  label={this.props.label}
                  orderable={this.props.orderable}
                  removeHandler={this.onRemove}
                  editHandler={this.props.editClickHandler}
                  moveHandler={this.onMove}
                />
              );
            })
          : this.maybeRenderPlaceholder(bucketStyle, this.props.label)}
      </ul>
    );
  }
}
