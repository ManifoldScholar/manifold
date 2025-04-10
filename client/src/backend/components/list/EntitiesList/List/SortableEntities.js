import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";

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
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
    sortableStyle: PropTypes.oneOf(["tight", "spaced"]),
    useDragHandle: PropTypes.bool,
    idForInstructions: PropTypes.string
  };

  static defaultProps = {
    useDragHandle: false,
    sortableStyle: "spaced"
  };

  static getDerivedStateFromProps(props, prevState) {
    if (props.entities === prevState.ref) return null;
    const orderedEntities = SortableEntities.cloneEntities(props.entities);
    return { orderedEntities, ref: props.entities };
  }

  constructor(props) {
    super(props);
    this.state = {
      sorting: false,
      orderedEntities: this.constructor.cloneEntities(props.entities),
      ref: props.entities
    };
  }

  findEntity(id) {
    return this.state.orderedEntities.find(e => e.id === id);
  }

  onDragEnd = result => {
    const { draggableId, source, destination } = result;
    const entity = this.findEntity(draggableId);

    if (!destination || !entity || source.index === destination.index)
      return null;

    this.setState(
      {
        orderedEntities: this.setOrderByChange(source.index, destination.index)
      },
      () => {
        this.reorderCallback(
          {
            id: entity.id,
            position: this.getAdjustedPosition(destination.index)
          },
          this.state.orderedEntities
        );
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

  get sortableStyle() {
    return this.props.sortableStyle;
  }

  get useDragHandle() {
    return this.props.useDragHandle;
  }

  get entityComponentProps() {
    return {
      ...this.props.entityComponentProps,
      listStyle: this.listStyle,
      sortableStyle: this.sortableStyle
    };
  }

  get reorderCallback() {
    return this.props.callbacks.onReorder;
  }

  get idForInstructions() {
    return this.props.idForInstructions;
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
    if (!entity || !entity.id) return index.toString();
    return entity.id;
  }

  render() {
    const EntityComponent = this.entityComponent;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="rbd-migration-resets">
          <Droppable droppableId="sortableEntities">
            {(provided, snapshot) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classNames(this.props.className, {
                  "show-dropzone": snapshot.isDraggingOver
                })}
              >
                {this.entities.map((entity, index) => (
                  <>
                    <Draggable
                      key={this.entityKey(index)}
                      draggableId={this.entityKey(index)}
                      index={index}
                    >
                      {(draggableProvided, draggableSnapshot) => (
                        <>
                          <EntityComponent
                            innerRef={draggableProvided.innerRef}
                            entity={entity}
                            dragHandleProps={draggableProvided.dragHandleProps}
                            draggableProps={draggableProvided.draggableProps}
                            useDragHandle={this.useDragHandle}
                            isDragging={draggableSnapshot.isDragging}
                            {...this.entityComponentProps}
                          />
                        </>
                      )}
                    </Draggable>
                    {snapshot.draggingFromThisWith === entity.id && (
                      <div
                        className={classNames("entity-row", "drag-placeholder")}
                      >
                        <EntityComponent
                          entity={entity}
                          {...this.entityComponentProps}
                        />
                      </div>
                    )}
                  </>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    );
  }
}
