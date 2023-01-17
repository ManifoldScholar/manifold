import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import Block from "../Block";
import { Droppable } from "react-beautiful-dnd";
import resolver from "../../helpers/resolver";
import { withTranslation } from "react-i18next";

class ProjectContentSectionsAvailable extends PureComponent {
  static displayName = "Project.Content.Sections.Available";

  static propTypes = {
    currentBlocks: PropTypes.array.isRequired,
    onClickAdd: PropTypes.func,
    headerId: PropTypes.string,
    instructionsId: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    currentBlocks: []
  };

  get types() {
    return Object.keys(resolver.blockComponentsByType());
  }

  render() {
    return (
      <div>
        <Header
          title={this.props.t("glossary.content_block_title_case_other")}
          subtitle={this.props.t("layout.blocks")}
          headerId={this.props.headerId}
          instructionsId={this.props.instructionsId}
        >
          {this.props.t("layout.customize_blocks_message")}
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

export default withTranslation()(ProjectContentSectionsAvailable);
