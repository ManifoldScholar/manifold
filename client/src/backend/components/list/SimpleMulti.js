import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default class ListSimpleMulti extends PureComponent {
  static displayName = "List.SimpleMulti";

  static propTypes = {
    entityPool: PropTypes.array,
    selectedEntities: PropTypes.array,
    poolHeader: PropTypes.func,
    selectedHeader: PropTypes.func,
    poolComponent: PropTypes.func.isRequired,
    listComponent: PropTypes.func.isRequired,
    afterSelectHandler: PropTypes.func.isRequired,
    afterReorderHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      entityPool: [
        { id: "1", attributes: { type: "ContentBlock::TOCBlock", name: "Texts" } },
        { id: "2", attributes: { type: "ContentBlock::ResourcesBlock", name: "Resources" } },
        { id: "3", attributes: { type: "ContentBlock::MarkdownBlock", name: "Markdown" } }
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

    switch (source.droppableId) {
      case destination.droppableId:
        return this.reorder(source, destination);
      case "entityPool":
        return this.copy(source, destination);
      default:
        return null;
    }
  };

  reorder(source, destination) {
    if (source.droppableId !== "selectedEntities") return null;

    const items = Array.from(this.selectedEntities);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);

    return this.setState({ selectedEntities: items }, () => {
      return this.props.afterReorderHandler(removed);
    });
  }

  // https://codesandbox.io/s/40p81qy7v0
  copy(source, destination) {
    const sourceClone = Array.from(this.entityPool);
    const destClone = Array.from(this.selectedEntities);
    const item = sourceClone[source.index];

    destClone.splice(destination.index, 0, { ...item, id: Math.random() }); // TODO: Something other than Math.random(), just needs to be unique

    return this.setState({ selectedEntities: destClone }, () => {
      return this.props.afterSelectHandler(item);
    });
  };

  renderEntityPool(props) {
    return (
      <React.Fragment>
        {props.poolHeader()}
        <Droppable droppableId="entityPool" isDropDisabled>
          {provided => (
            <div ref={provided.innerRef} className="list">
              {this.entityPool.map((entity, index) => props.poolComponent(entity, index))}
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
          {provided => (
            <div ref={provided.innerRef} className="list drag-container">
              {this.selectedEntities.length
                ? this.selectedEntities.map((entity, index) => props.listComponent(entity, index))
                : null}
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
