import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import Block from "../Block";
import { Droppable } from "react-beautiful-dnd";
import classNames from "classnames";

export default class ProjectContentSectionsCurrent extends PureComponent {
  static displayName = "Project.Content.Sections.Current";

  static propTypes = {
    currentBlocks: PropTypes.array.isRequired,
    entityCallbacks: PropTypes.object.isRequired
  };

  static defaultProps = {
    currentBlocks: []
  };

  bindEntityCallbacks(block) {
    const callbacks = this.props.entityCallbacks;
    /* eslint-disable no-param-reassign */
    return Object.keys(callbacks).reduce((memo, key) => {
      memo[key] = () => callbacks[key](block);
      return memo;
    }, {});
    /* eslint-enable no-param-reassign */
  }

  render() {
    return (
      <div className="form-section">
        <Header title="Content Layout">
          Use the icons on the right of each content block to reorder them, edit
          their settings, change their visibility, or remove them.
        </Header>
        <Droppable droppableId="current">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={classNames("content-block-list full-width", {
                "content-block-list--show-dropzone": snapshot.isDraggingOver
              })}
            >
              {this.props.currentBlocks.map((block, index) => (
                <Block
                  entityCallbacks={this.bindEntityCallbacks(block)}
                  currentBlocks={this.props.currentBlocks}
                  key={block.id}
                  context="current"
                  entity={block}
                  type={block.attributes.type}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}
