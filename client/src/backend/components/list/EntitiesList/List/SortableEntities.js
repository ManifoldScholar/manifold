import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

export default class SortableEntities extends PureComponent {
  static displayName = "List.Entities.List.SortableEntities";

  static cloneEntities(entities) {
    const source = entities || [];
    return source.slice(0);
  }

  static propTypes = {
    callbacks: PropTypes.object,
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare"]),
    useDragHandle: PropTypes.bool
  };

  static defaultProps = {
    useDragHandle: false
  };

  static getDerivedStateFromProps(props, prevState) {
    if (props.entities === prevState.ref) return null;
    const orderedEntities = SortableEntities.cloneEntities(props.entities);
    return { orderedEntities, ref: props.entities };
  }

  constructor(props) {
    super(props);
    this.ul = React.createRef();
    this.state = {
      sorting: false,
      orderedEntities: this.constructor.cloneEntities(props.entities),
      ref: props.entities
    };
  }

  // Returning a promise from this did not work as advertised in the docs.
  onUpdateBeforeSortStart = () => {
    if (!this.ul.current) return;
    this.ul.current.classList.add("entity-list--dragging");
  };

  onSortEnd = result => {
    if (!result) return null;

    const entity = this.state.orderedEntities[result.oldIndex];
    if (!entity) return null;

    if (this.ul.current)
      this.ul.current.classList.remove("entity-list--dragging");

    if (result.newIndex === result.oldIndex) return;

    this.setState(
      {
        orderedEntities: this.setOrderByChange(result.oldIndex, result.newIndex)
      },
      () => {
        const adjustedPosition = this.getAdjustedPosition(result.newIndex);

        this.reorderCallback({
          id: entity.id,
          position: adjustedPosition
        });
      }
    );
  };

  get entities() {
    return this.state.orderedEntities;
  }

  get entityComponent() {
    return this.props.entityComponent;
  }

  get listStyle() {
    return this.props.listStyle;
  }

  get useDragHandle() {
    return this.props.useDragHandle;
  }

  get entityComponentProps() {
    return Object.assign({}, this.props.entityComponentProps, {
      listStyle: this.listStyle
    });
  }

  get reorderCallback() {
    return this.props.callbacks.onReorder;
  }

  get className() {
    return this.props.className;
  }

  getAdjustedPosition(position) {
    const entityCount = this.state.orderedEntities.length;

    if (position <= 0) return "top";
    if (position >= entityCount) return "bottom";
    return position + 1;
  }

  setOrderByChange(oldPos, newPos) {
    const ordered = Array.from(this.state.orderedEntities);
    const [removed] = ordered.splice(oldPos, 1);
    ordered.splice(newPos, 0, removed);

    return ordered;
  }

  entityKey(index) {
    const entity = this.entities[index];
    if (!entity || !entity.id) return index;
    return entity.id;
  }

  render() {
    const { entityComponent: EntityComponent } = this;

    const SortableEntityComponent = SortableElement(
      ({ sortableEntity, index }) => {
        return (
          <EntityComponent
            isSortable
            key={this.entityKey(index)}
            entity={sortableEntity}
            {...this.entityComponentProps}
          />
        );
      }
    );

    const List = SortableContainer(({ entities }) => {
      return (
        <ul ref={this.ul} className={this.className}>
          {entities.map((entity, index) => (
            <SortableEntityComponent
              sortableEntity={entity}
              key={this.entityKey(index)}
              index={index}
            />
          ))}
        </ul>
      );
    });

    return (
      <List
        entities={this.entities}
        helperClass="entity-row--dragging"
        updateBeforeSortStart={this.onUpdateBeforeSortStart}
        onSortEnd={this.onSortEnd}
        useDragHandle={this.useDragHandle}
        axis="xy"
      />
    );
  }
}
