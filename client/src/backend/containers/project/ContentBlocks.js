import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import List from "backend/components/list";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

import Authorize from "hoc/authorize";
import Attribute from "../../components/form/AttributeMap/Attribute";

export default class ProjectContentBlocksContainer extends PureComponent {
  static displayName = "Project.ContentBlocks";

  static propTypes = {
    project: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {}
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = source;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  entityComponent = (entity, index, styles) => {
    return (
      <Draggable draggableId={entity.id} key={entity.id} index={index}>
        {(provided, snapshot) => {
          const style = {
            ...styles,
            ...provided.draggableProps.style
          };

          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={style}
            >
              {entity.value}
            </div>
          )
        }}
      </Draggable>
    );
  };

  contentBlocksHeader = () => {
    return (
      <div>
        <h1>Content Blocks</h1>
        <span>Some instructions about content blocks</span>
      </div>
    )
  };

  contentLayoutHeader = () => {
    return (
      <div>
        <h1>Content Layout</h1>
        <span>Some instructions about content layout</span>
      </div>
    )
  };

  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <List.SimpleMulti
            entityComponent={this.entityComponent}
            orderChangeHandler={this.reorder}
            selectHandler={this.move}
            selectedHeader={this.contentLayoutHeader}
            poolHeader={this.contentBlocksHeader}
          />
        </section>
      </Authorize>
    );
  }
}
