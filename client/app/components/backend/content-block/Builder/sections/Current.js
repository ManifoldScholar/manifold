import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import resolver from "../../helpers/resolver";
import Block from "../Block";
import { Droppable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";
import { withTranslation } from "react-i18next";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";

class ProjectContentSectionsCurrent extends PureComponent {
  static displayName = "Project.Content.Sections.Current";

  static propTypes = {
    currentBlocks: PropTypes.array.isRequired,
    entityCallbacks: PropTypes.object.isRequired,
    activeDraggableType: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    currentBlocks: []
  };

  get announce() {
    return this.props.setScreenReaderStatus;
  }

  get topBlocks() {
    return this.props.currentBlocks.filter(
      block => resolver.typeToBlockComponent(block.attributes.type).top === true
    );
  }

  get bottomBlocks() {
    return this.props.currentBlocks.filter(
      block => resolver.typeToBlockComponent(block.attributes.type).top !== true
    );
  }

  get zones() {
    return {
      top: { blocks: this.topBlocks, visible: false },
      bottom: { blocks: this.bottomBlocks, visible: true }
    };
  }

  bindEntityCallbacks(block) {
    const callbacks = this.props.entityCallbacks;
    /* eslint-disable no-param-reassign */
    return Object.keys(callbacks).reduce((memo, key) => {
      memo[key] = addtlParams => callbacks[key](block, addtlParams);
      return memo;
    }, {});
    /* eslint-enable no-param-reassign */
  }

  showDropzone(zone) {
    if (this.props.activeDraggableType === zone.toUpperCase()) return true;
    return this.zones[zone].visible && this.zones[zone].blocks.length === 0;
  }

  render() {
    return (
      <>
        <div>
          <Header subtitle={this.props.t("layout.layout")} />
          {Object.keys(this.zones).map(zone => (
            <Droppable
              key={zone}
              type={zone.toUpperCase()}
              droppableId={`current-${zone}`}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={classNames("content-block-list full-width", {
                    "content-block-list--show-dropzone": this.showDropzone(zone)
                  })}
                >
                  {this.zones[zone].blocks.map((block, index) => (
                    <Block
                      entityCallbacks={this.bindEntityCallbacks(block)}
                      currentBlocks={this.props.currentBlocks}
                      key={block.id}
                      context="current"
                      entity={block}
                      type={block.attributes.type}
                      index={index}
                      entityCount={this.zones[zone].blocks.length}
                      isDragging={snapshot.draggingFromThisWith === block.id}
                      announce={this.announce}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
        {this.props.renderLiveRegion("alert")}
      </>
    );
  }
}

export default withTranslation()(
  withScreenReaderStatus(ProjectContentSectionsCurrent, false)
);
