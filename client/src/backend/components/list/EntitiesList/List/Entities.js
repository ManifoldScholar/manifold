import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListEntitiesListEntities extends PureComponent {
  static displayName = "List.Entities.List.Entities";

  static propTypes = {
    callbacks: PropTypes.object,
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare"])
  };

  get entities() {
    return this.props.entities;
  }

  get entityComponent() {
    return this.props.entityComponent;
  }

  get listStyle() {
    return this.props.listStyle;
  }

  get entityComponentProps() {
    return Object.assign({}, this.props.entityComponentProps, {
      listStyle: this.listStyle
    });
  }

  get className() {
    return this.props.className;
  }

  entityKey(index) {
    const entity = this.entities[index];
    if (!entity || !entity.id) return index;
    return entity.id;
  }

  render() {
    const EntityComponent = this.entityComponent;
    return (
      <ul className={this.className}>
        {this.entities.map((entity, index) => (
          <EntityComponent
            key={this.entityKey(index)}
            entity={entity}
            {...this.entityComponentProps}
          />
        ))}
      </ul>
    );
  }
}
