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
    onClickAdd: PropTypes.func,
    headerId: PropTypes.string,
    instructionsId: PropTypes.string
  };

  static defaultProps = {
    currentBlocks: []
  };

  get types() {
    return Object.keys(resolver.blockComponentsByType());
  }

  render() {
    return (
      <div className="form-section form-section--primary">
        <Header
          title="Content Blocks"
          subtitle="Blocks:"
          headerId={this.props.headerId}
          instructionsId={this.props.instructionsId}
        >
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
              direction="horizontal"
            >
              {provided => (
                <div ref={provided.innerRef}>
                  <Block
                    currentBlocks={this.props.currentBlocks}
                    context="available"
                    type={type}
                    index={index}
                    onClickAdd={this.props.onClickAdd}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    );
  }
}
