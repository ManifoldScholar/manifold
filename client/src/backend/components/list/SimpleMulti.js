import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

export default class ListSimpleMulti extends PureComponent {
  static displayName = "List.SimpleMulti";

  static propTypes = {
    entityPool: PropTypes.array,
    selectedEntities: PropTypes.array,
    poolHeader: PropTypes.func,
    selectedHeader: PropTypes.func,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    selectHandler: PropTypes.func.isRequired,
    orderChangeHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      entityPool: [
        { id: "1", value: "one" },
        { id: "2", value: "two" },
        { id: "3", value: "three" }
      ],
      selectedEntities: []
    }
  }

  get entityPool() {
    return this.state.entityPool;
  }

  get selectedEntities() {
    return this.state.selectedEntities;
  }

  onDragEnd = result => {
    const { source, destination } = result;
    if (!destination) return null;

    if (source.droppableId === destination.droppableId) {
      return this.reorderEntity(source, destination);
    } else {
      return this.selectEntity(source, destination);
    }
  };

  reorderEntity(source, destination) {
    const items = this.props.orderChangeHandler(
      this.entityPool,
      source.index,
      destination.index
    );

    let state = { items };

    if (source.droppableId === "selectedEntities") {
      state = { selectedEntities: items };
    }

    return this.setState(state);
  }

  selectEntity(source, destination) {
    const result = this.props.selectHandler(
      this.entityPool,
      this.selectedEntities,
      source,
      destination
    );

    this.setState({
      entityPool: result.entityPool,
      selectedEntities: result.selectedEntities
    });
  }

  renderEntityPool(props) {
    return (
      <React.Fragment>
        {props.poolHeader()}
        <Droppable droppableId="entityPool" isDropDisabled>
          {(provided, snapshotIgnored) => (
            <div ref={provided.innerRef} style={{ padding: 75, backgroundColor: "gray" }}>
              {this.entityPool.map((entity, index) => {
                return props.entityComponent(entity, index, { padding: 20, backgroundColor: "pink", margin: 10, color: "black", display: "inline-block" });
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </React.Fragment>
    );
  }

  renderSelectedEntities(props) {
    return (
      <React.Fragment>
        {props.selectedHeader()}
        <Droppable droppableId="selectedEntities">
          {(provided, snapshotIgnored) => (
            <div ref={provided.innerRef} style={{ padding: 75, backgroundColor: "blue" }}>
              {this.selectedEntities.map((entity, index) => {
                return props.entityComponent(entity, index, { padding: 20, backgroundColor: "pink", margin: 10, color: "black"});
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </React.Fragment>
    )
  }

  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        {this.renderEntityPool(this.props)}
        {this.renderSelectedEntities(this.props)}
      </DragDropContext>
    );
  }
}
