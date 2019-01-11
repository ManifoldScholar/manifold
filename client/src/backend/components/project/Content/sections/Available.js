import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import Block from "../Block";
import { Droppable } from "react-beautiful-dnd";

export default class ProjectContentSectionsAvailable extends PureComponent {
  static displayName = "Project.Content.Sections.Available";

  static propTypes = {
    currentBlocks: PropTypes.array.isRequired
  };

  static defaultProps = {
    currentBlocks: []
  };

  static types = [
    "Content::RecentActivityBlock",
    "Content::ResourcesBlock",
    "Content::MetadataBlock",
    "Content::TableOfContentsBlock",
    "Content::MarkdownBlock"
  ];

  get types() {
    return this.constructor.types;
  }

  render() {
    return (
      <React.Fragment>
        <Header title="Content Blocks">
          Drag content blocks directly into your project page layout, or use the
          plus symbol to add them.
        </Header>
        <Droppable droppableId="available" isDropDisabled>
          {provided => (
            <div ref={provided.innerRef} className="list available">
              {this.types.map((type, index) => (
                <Block
                  currentBlocks={this.props.currentBlocks}
                  key={type}
                  context="available"
                  type={type}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </React.Fragment>
    );
  }
}
