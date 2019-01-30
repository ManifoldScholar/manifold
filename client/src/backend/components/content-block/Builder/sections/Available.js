import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import Block from "../Block";
import { Droppable } from "react-beautiful-dnd";
import resolver from "../../helpers/resolver";

export default class ProjectContentSectionsAvailable extends PureComponent {
  static displayName = "Project.Content.Sections.Available";

  static propTypes = {
    currentBlocks: PropTypes.array.isRequired,
    onClickAdd: PropTypes.func
  };

  static defaultProps = {
    currentBlocks: []
  };

  get types() {
    return Object.keys(resolver.blockComponentsByType());
  }

  render() {
    return (
      <div className="form-section">
        <Header title="Content Blocks" subtitle="Blocks:">
          Customize the rest of the content on your project page. Add, delete,
          and reorder content blocks, edit settings, and toggle visibility.
        </Header>
        <div className="block-grid full-width">
          {this.types.map((type, index) => (
            <Droppable
              key={type}
              type={
                resolver.blockComponentsByType()[type].top ? "TOP" : "BOTTOM"
              }
              droppableId={`available-${type}`}
              isDropDisabled
            >
              {provided => (
                <React.Fragment>
                  <div ref={provided.innerRef}>
                    <Block
                      currentBlocks={this.props.currentBlocks}
                      context="available"
                      type={type}
                      index={index}
                      onClickAdd={this.props.onClickAdd}
                    />
                  </div>
                  {provided.placeholder}
                </React.Fragment>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    );
  }
}
