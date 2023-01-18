import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import AvailableSection from "./sections/Available";
import CurrentSection from "./sections/Current";
import DraggableEventHelper from "../helpers/draggableEvent";
import { contentBlocksAPI, requests } from "api";
import { DragDropContext } from "react-beautiful-dnd";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";
import configHelper from "../helpers/configurations";
import cloneDeep from "lodash/cloneDeep";
import { UIDConsumer } from "react-uid";
import { withTranslation } from "react-i18next";

const { request } = entityStoreActions;

export class ProjectContent extends PureComponent {
  static displayName = "ContentBlock.Builder";

  static propTypes = {
    project: PropTypes.object,
    contentBlocks: PropTypes.array,
    contentBlocksResponse: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    history: PropTypes.object,
    children: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func
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
      blocks: ProjectContent.cloneBlocks(props),
      activeDraggableType: null,
      response: props.contentBlocksResponse
    };
  }

  onDragStart = ({ type }) => {
    this.setState({ activeDraggableType: type });
  };

  onDragEnd = draggable => {
    this.setState({ activeDraggableType: null });
    const draggableHelper = new DraggableEventHelper(
      draggable,
      this.currentBlocks
    );
    if (!draggableHelper.actionable) return;
    const action = draggableHelper.action;
    let callback;
    if (action === "move")
      callback = () => this.updateBlock(draggableHelper.block);
    if (action === "insert") callback = this.newBlock;
    this.setState({ blocks: draggableHelper.blocks }, callback);
  };

  get projectId() {
    return this.props.project.id;
  }

  get currentBlocks() {
    return this.state.blocks;
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

  editBlock = block => {
    this.props.history.push(
      lh.link("backendProjectContentBlock", this.projectId, block.id),
      { noScroll: true }
    );
  };

  newBlock = () => {
    configHelper.isConfigurable(this.pendingBlock.attributes.type)
      ? this.props.history.push(
          lh.link("backendProjectContentBlockNew", this.projectId)
        )
      : this.createBlock();
  };

  createBlock() {
    const call = contentBlocksAPI.create(this.projectId, this.pendingBlock);
    const createRequest = request(call, requests.beContentBlockCreate);
    this.props.dispatch(createRequest).promise.then(() => {
      this.props.refresh();
    });
  }

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

  toggleBlockVisibility(block, visible) {
    const adjusted = { ...block };
    adjusted.attributes.visible = visible;

    this.updateBlock(adjusted);
  }

  showBlock = block => {
    this.toggleBlockVisibility(block, true);
  };

  hideBlock = block => {
    this.toggleBlockVisibility(block, false);
  };

  handleAddEntity = type => {
    const draggableHelper = new DraggableEventHelper(
      DraggableEventHelper.syntheticDraggable(type),
      this.currentBlocks
    );
    this.setState({ blocks: draggableHelper.blocks }, this.newBlock);
  };

  handleDeleteBlock = block => {
    const heading = this.props.t("modals.delete_block");
    const message = this.props.t("modals.confirm_body");
    this.props.confirm(heading, message, () => this.deleteBlock(block));
  };

  render() {
    return (
      <section className="backend-project-content">
        <UIDConsumer name={id => `content-block-builder-${id}`}>
          {id => (
            <div
              className="form-secondary"
              role="group"
              aria-labelledby={`${id}-header`}
              aria-describedby={`${id}-instructions`}
            >
              <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
              >
                <AvailableSection
                  onClickAdd={this.handleAddEntity}
                  currentBlocks={this.currentBlocks}
                  headerId={`${id}-header`}
                  instructionsId={`${id}-instructions`}
                />
                <CurrentSection
                  activeDraggableType={this.state.activeDraggableType}
                  entityCallbacks={this.entityCallbacks}
                  currentBlocks={this.currentBlocks}
                />
              </DragDropContext>
              {this.props.children(this.drawerCloseCallback, this.pendingBlock)}
            </div>
          )}
        </UIDConsumer>
      </section>
    );
  }
}

export default withTranslation()(withConfirmation(ProjectContent));
