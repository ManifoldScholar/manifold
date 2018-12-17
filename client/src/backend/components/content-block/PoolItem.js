import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { Draggable } from "react-beautiful-dnd";

export default class ContentBlockPoolItem extends PureComponent {
  static displayName = "ContentBlock.PoolItem";

  static propTypes = {
    entity: PropTypes.object,
    index: PropTypes.number,
    draggable: PropTypes.bool
  };

  static defaultProps = {
    draggable: false
  };

  get content() {
    const { entity } = this.props;

    return (
      <React.Fragment>
        <Utility.IconComposer icon={this.icon(entity.attributes.type)} size={30} />
        {entity.attributes.name}
      </React.Fragment>
    )
  }

  // Maybe this comes from the config object for a ContentBlock instead
  icon(type) {
    switch (type) {
      case "ContentBlock::TOCBlock":
        return "bars-double-horizontal";
      case "ContentBlock::ResourcesBlock":
        return "new-round";
      case "ContentBlock::MarkdownBlock":
        return "lamp";
      default:
        return null;
    }
  }

  render() {
    const { entity } = this.props;
    const id = Math.random(); // This should be the kind from config
    if (!entity) return null;

    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <React.Fragment>
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={provided.draggableProps.style}
                className="item pool"
              >
                {this.content}
              </div>
              {snapshot.isDragging && <div className="item pool clone">{this.content}</div>}
            </React.Fragment>
          )
        }}
      </Draggable>
    );
  }
}
