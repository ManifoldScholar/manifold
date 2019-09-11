import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Empty from "./Empty";

export default class ListEntitiesListEntities extends PureComponent {
  static displayName = "List.Entities.List.Entities";

  static propTypes = {
    callbacks: PropTypes.object,
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    emptyMessage: PropTypes.node,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare"]),
    idForInstructions: PropTypes.string
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
    return { ...this.props.entityComponentProps, listStyle: this.listStyle };
  }

  get className() {
    return this.props.className;
  }

  get isEmpty() {
    return this.entities.length === 0;
  }

  get emptyMessage() {
    return this.props.emptyMessage;
  }

  get idForInstructions() {
    return this.props.idForInstructions;
  }

  entityKey(index) {
    const entity = this.entities[index];
    if (!entity || !entity.id) return index;
    return entity.id;
  }

  render() {
    const EntityComponent = this.entityComponent;

    if (this.isEmpty) return <Empty message={this.emptyMessage} />;

    return (
      <ul className={this.className} aria-describedby={this.idForInstructions}>
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
