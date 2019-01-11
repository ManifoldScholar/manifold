import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import AvailableSection from "./sections/Available";
import CurrentSection from "./sections/Current";
import { contentBlocksAPI, requests } from "api";
import { DragDropContext } from "react-beautiful-dnd";
import Developer from "global/components/developer";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";
import configHelper from "./helpers/configurations";
import cloneDeep from "lodash/cloneDeep";

const { request } = entityStoreActions;

export default class ProjectContent extends PureComponent {
  static displayName = "Project.Content";

  static propTypes = {
    project: PropTypes.object,
    contentBlocks: PropTypes.array,
    contentBlocksResponse: PropTypes.object,
    refresh: PropTypes.func.isRequired,
    history: PropTypes.object,
    children: PropTypes.func,
    dispatch: PropTypes.func.isRequired
  };

  static cloneBlocks(props) {
    const blocks = props.contentBlocks || [];
    return cloneDeep(blocks);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.contentBlocksResponse === state.response) return null;

    const blocks = ProjectContent.cloneBlocks(props);
    return { blocks, response: props.contentBlocksResponse };
  }

  constructor(props) {
    super(props);

    this.state = {
      blocks: [],
      response: props.contentBlocksResponse
    };
  }

  onDragEnd = rawResult => {
    const result = this.mapRawDragResult(rawResult);
    if (!result) return;
    const {
      type,
      sourceIndex,
      sourceList,
      destinationIndex,
      destinationList
    } = result;
    if (sourceList === "current" && destinationList === "current")
      return this.move(sourceIndex, destinationIndex);
    if (sourceList === "available" && destinationList === "current")
      return this.insert(type, destinationIndex);
  };

  get projectId() {
    return this.props.project.id;
  }

  get currentBlocks() {
    return this.state.blocks;
  }

  get clonedCurrentBlocks() {
    return Array.from(this.currentBlocks);
  }

  get entityCallbacks() {
    return {
      showBlock: this.showBlock,
      hideBlock: this.hideBlock,
      deleteBlock: this.deleteBlock,
      saveBlockPosition: this.updateBlock,
      editBlock: this.editBlock
    };
  }

  get drawerCloseCallback() {
    if (!this.pendingBlock) return null;
    return this.resetState;
  }

  get pendingBlock() {
    return this.state.blocks.find(block => block.id === "pending");
  }

  resetState = () => {
    this.setState({ blocks: this.constructor.cloneBlocks(this.props) });
  };

  move(from, to) {
    const adjustedTo = to < 0 ? 0 : to; // TODO: Why is to sometimes -1?
    const blocks = this.clonedCurrentBlocks;
    const [block] = blocks.splice(from, 1);
    const updatedBlock = this.updateBlockPosition(block, adjustedTo);
    blocks.splice(adjustedTo, 0, updatedBlock);
    this.setState({ blocks }, () => this.updateBlock(updatedBlock));
  }

  insert(type, position, id = "pending") {
    const block = { id, attributes: { type, position }, relationships: {} };
    const blocks = this.clonedCurrentBlocks;
    blocks.splice(position, 0, block);
    this.setState({ blocks }, this.newBlock);
  }

  newBlock = () => {
    configHelper.isConfigurable(this.pendingBlock.attributes.type)
      ? this.props.history.push(
          lh.link("backendProjectContentBlockNew", this.projectId)
        )
      : this.createBlock();
  };

  editBlock = block => {
    this.props.history.push(
      lh.link("backendProjectContentBlock", this.projectId, block.id)
    );
  };

  updateBlock = block => {
    const call = contentBlocksAPI.update(block.id, {
      attributes: block.attributes
    });
    const options = { noTouch: true };
    const updateRequest = request(call, requests.beContentBlockUpdate, options);
    this.props.dispatch(updateRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  // TODO: Do we want confirmation first?
  deleteBlock = block => {
    const call = contentBlocksAPI.destroy(block.id);
    const options = { removes: { type: "contentBlocks", id: block.id } };
    const destroyRequest = request(
      call,
      requests.beContentBlockDestroy,
      options
    );
    this.props.dispatch(destroyRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  createBlock() {
    const call = contentBlocksAPI.create(this.projectId, this.pendingBlock);
    const createRequest = request(call, requests.beContentBlockCreate);
    this.props.dispatch(createRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  toggleBlockVisibility(block, visible) {
    const adjusted = Object.assign({}, block);
    adjusted.attributes.visible = visible;

    this.updateBlock(adjusted);
  }

  showBlock = block => {
    this.toggleBlockVisibility(block, true);
  };

  hideBlock = block => {
    this.toggleBlockVisibility(block, false);
  };

  mapRawDragResult(result) {
    if (!result.destination || !result.source) return;
    const {
      draggableId: type,
      source: { index: sourceIndex, droppableId: sourceList },
      destination: { index: destinationIndex, droppableId: destinationList }
    } = result;
    return { type, sourceIndex, sourceList, destinationIndex, destinationList };
  }

  updateBlockPosition(block, position) {
    const attributes = Object.assign({}, block.attributes, {
      position: this.adjustedPosition(position)
    });
    return Object.assign({}, block, { attributes });
  }

  adjustedPosition(position) {
    const max = this.state.blocks.length;

    if (position <= 0) return "top";
    if (position >= max) return "bottom";
    return position;
  }

  render() {
    return (
      <section className="backend-project-content">
        <Developer.Debugger object={{ props: this.props, state: this.state }} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <AvailableSection currentBlocks={this.currentBlocks} />
          <CurrentSection
            entityCallbacks={this.entityCallbacks}
            currentBlocks={this.currentBlocks}
          />
        </DragDropContext>
        {this.props.children(this.drawerCloseCallback, this.pendingBlock)}
      </section>
    );
  }
}
