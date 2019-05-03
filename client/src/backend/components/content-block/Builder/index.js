import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { contentBlocksAPI, requests } from "api";
import { DragDropContext } from "react-beautiful-dnd";
import withConfirmation from "hoc/with-confirmation";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";
import cloneDeep from "lodash/cloneDeep";
import configHelper from "../helpers/configurations";
import DraggableEventHelper from "../helpers/draggableEvent";
import CurrentSection from "./sections/Current";
import AvailableSection from "./sections/Available";

const { request } = entityStoreActions;

export class ProjectContent extends PureComponent {
  static cloneBlocks(props) {
    const blocks = props.contentBlocks || [];
    return cloneDeep(blocks);
  }

  static displayName = "ContentBlock.Builder";

  static getDerivedStateFromProps(props, state) {
    if (props.contentBlocksResponse === state.response) return null;

    const blocks = ProjectContent.cloneBlocks(props);
    return { blocks, response: props.contentBlocksResponse };
  }

  static propTypes = {
    project: PropTypes.object,
    contentBlocks: PropTypes.array,
    contentBlocksResponse: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    history: PropTypes.object,
    children: PropTypes.func,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      blocks: ProjectContent.cloneBlocks(props),
      activeDraggableType: null,
      response: props.contentBlocksResponse
    };
  }

  onDragEnd = draggable => {
    this.setState({ activeDraggableType: null });
    const draggableHelper = new DraggableEventHelper(
      draggable,
      this.currentBlocks
    );
    if (!draggableHelper.actionable) return;
    const { action } = draggableHelper;
    let callback;
    if (action === "move")
      callback = () => this.updateBlock(draggableHelper.block);
    if (action === "insert") callback = this.newBlock;
    this.setState({ blocks: draggableHelper.blocks }, callback);
  };

  onDragStart = draggable => {
    this.setState({ activeDraggableType: draggable.type });
  };

  get currentBlocks() {
    return this.state.blocks;
  }

  get drawerCloseCallback() {
    if (!this.pendingBlock) return null;
    return this.resetState;
  }

  get entityCallbacks() {
    return {
      showBlock: this.showBlock,
      hideBlock: this.hideBlock,
      deleteBlock: this.handleDeleteBlock,
      saveBlockPosition: this.updateBlock,
      editBlock: this.editBlock
    };
  }

  get pendingBlock() {
    return this.state.blocks.find(block => block.id === "pending");
  }

  get projectId() {
    return this.props.project.id;
  }

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

  editBlock = block => {
    this.props.history.push(
      lh.link("backendProjectContentBlock", this.projectId, block.id),
      { noScroll: true }
    );
  };

  handleAddEntity = type => {
    const draggableHelper = new DraggableEventHelper(
      DraggableEventHelper.syntheticDraggable(type),
      this.currentBlocks
    );
    this.setState({ blocks: draggableHelper.blocks }, this.newBlock);
  };

  handleDeleteBlock = block => {
    const heading = "Are you sure you want to delete this content block?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, () => this.deleteBlock(block));
  };

  hideBlock = block => {
    this.toggleBlockVisibility(block, false);
  };

  newBlock = () => {
    configHelper.isConfigurable(this.pendingBlock.attributes.type)
      ? this.props.history.push(
          lh.link("backendProjectContentBlockNew", this.projectId)
        )
      : this.createBlock();
  };

  resetState = () => {
    this.setState({ blocks: this.constructor.cloneBlocks(this.props) });
  };

  showBlock = block => {
    this.toggleBlockVisibility(block, true);
  };

  updateBlock = block => {
    const call = contentBlocksAPI.update(block.id, {
      attributes: block.attributes
    });
    const options = { noTouch: true, notificationScope: "none" };
    const updateRequest = request(call, requests.beContentBlockUpdate, options);
    this.props.dispatch(updateRequest).promise.then(() => {
      this.props.refresh();
    });
  };

  toggleBlockVisibility(block, visible) {
    const adjusted = Object.assign({}, block);
    adjusted.attributes.visible = visible;

    this.updateBlock(adjusted);
  }

  createBlock() {
    const call = contentBlocksAPI.create(this.projectId, this.pendingBlock);
    const createRequest = request(call, requests.beContentBlockCreate);
    this.props.dispatch(createRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  render() {
    return (
      <section className="backend-project-content">
        <div className="form-secondary">
          <DragDropContext
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
          >
            <AvailableSection
              onClickAdd={this.handleAddEntity}
              currentBlocks={this.currentBlocks}
            />
            <CurrentSection
              activeDraggableType={this.state.activeDraggableType}
              entityCallbacks={this.entityCallbacks}
              currentBlocks={this.currentBlocks}
            />
          </DragDropContext>
          {this.props.children(this.drawerCloseCallback, this.pendingBlock)}
        </div>
      </section>
    );
  }
}

export default withConfirmation(ProjectContent);
