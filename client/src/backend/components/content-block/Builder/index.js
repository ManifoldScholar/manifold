import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import AvailableSection from "./sections/Available";
import CurrentSection from "./sections/Current";
import DraggableEventHelper from "../helpers/draggableEvent";
import { contentBlocksAPI, requests } from "api";
import { DragDropContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";
import configHelper from "../helpers/configurations";
import cloneDeep from "lodash/cloneDeep";
import { UIDConsumer } from "react-uid";

const { request } = entityStoreActions;

const cloneBlocks = contentBlocks => {
  const blocks = contentBlocks || [];
  return cloneDeep(blocks);
};

function ProjectContent({
  project,
  contentBlocks,
  contentBlocksResponse,
  confirm,
  refresh,
  children
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blocks, setBlocks] = useState(() => cloneBlocks(contentBlocks));
  const [activeDraggableType, setActiveDraggableType] = useState(null);
  const [response, setResponse] = useState(contentBlocksResponse);

  useEffect(() => {
    if (contentBlocksResponse !== response) {
      setBlocks(cloneBlocks(contentBlocks));
      setResponse(contentBlocksResponse);
    }
  }, [contentBlocksResponse, response, contentBlocks]);

  const projectId = project.id;
  const currentBlocks = blocks;
  const pendingBlock = blocks.find(block => block.id === "pending");

  const createBlock = () => {
    const call = contentBlocksAPI.create(projectId, pendingBlock);
    const createRequest = request(call, requests.beContentBlockCreate);
    dispatch(createRequest).promise.then(() => {
      refresh();
    });
  };

  const updateBlock = (block, callback) => {
    const call = contentBlocksAPI.update(block.id, {
      attributes: block.attributes
    });
    const options = { noTouch: true, notificationScope: "none" };
    const updateRequest = request(call, requests.beContentBlockUpdate, options);
    dispatch(updateRequest).promise.then(() => {
      refresh();
      if (callback && typeof callback === "function") {
        callback();
      }
    });
  };

  const newBlock = () => {
    if (configHelper.isConfigurable(pendingBlock.attributes.type)) {
      navigate(lh.link("backendProjectContentBlockNew", projectId));
    } else {
      createBlock();
    }
  };

  const onDragStart = ({ type }) => {
    setActiveDraggableType(type);
  };

  const onDragEnd = draggable => {
    setActiveDraggableType(null);
    const draggableHelper = new DraggableEventHelper(draggable, currentBlocks);
    if (!draggableHelper.actionable) return;
    const action = draggableHelper.action;
    let callback;
    if (action === "move") callback = () => updateBlock(draggableHelper.block);
    if (action === "insert") callback = newBlock;
    setBlocks(draggableHelper.blocks);
    if (callback) callback();
  };

  const onKeyboardMove = (block, addtlParams) => {
    const { index, direction, callback } = addtlParams;
    const newIndex = direction === "down" ? index + 1 : index - 1;

    const filteredBlocks = currentBlocks.filter(b => b.id !== block.id);
    const updatedBlocks = filteredBlocks.toSpliced(newIndex, 0, block);

    const clonedBlock = cloneDeep(block);
    clonedBlock.attributes.position = newIndex + 1; // position starts from 1, index from 0

    setBlocks(updatedBlocks);
    updateBlock(clonedBlock, callback);
  };

  const resetState = () => {
    setBlocks(cloneBlocks(contentBlocks));
  };

  const editBlock = block => {
    navigate(lh.link("backendProjectContentBlock", projectId, block.id), {
      state: { noScroll: true }
    });
  };

  const deleteBlock = block => {
    const call = contentBlocksAPI.destroy(block.id);
    const options = { removes: { type: "contentBlocks", id: block.id } };
    const destroyRequest = request(
      call,
      requests.beContentBlockDestroy,
      options
    );
    dispatch(destroyRequest).promise.then(() => {
      refresh();
    });
  };

  const toggleBlockVisibility = (block, visible) => {
    const adjusted = { ...block };
    adjusted.attributes.visible = visible;
    updateBlock(adjusted);
  };

  const showBlock = block => {
    toggleBlockVisibility(block, true);
  };

  const hideBlock = block => {
    toggleBlockVisibility(block, false);
  };

  const handleAddEntity = type => {
    const draggableHelper = new DraggableEventHelper(
      DraggableEventHelper.syntheticDraggable(type),
      currentBlocks
    );
    setBlocks(draggableHelper.blocks);
    newBlock();
  };

  const handleDeleteBlock = block => {
    const heading = t("modals.delete_block");
    const message = t("modals.confirm_body");
    confirm(heading, message, () => deleteBlock(block));
  };

  const entityCallbacks = {
    showBlock,
    hideBlock,
    deleteBlock: handleDeleteBlock,
    saveBlockPosition: updateBlock,
    editBlock,
    onKeyboardMove
  };

  const drawerCloseCallback = pendingBlock ? resetState : null;

  return (
    <section className="backend-project-content rbd-migration-resets">
      <UIDConsumer name={id => `content-block-builder-${id}`}>
        {id => (
          <div
            className="form-secondary"
            role="group"
            aria-labelledby={`${id}-header`}
            aria-describedby={`${id}-instructions`}
          >
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <AvailableSection
                onClickAdd={handleAddEntity}
                currentBlocks={currentBlocks}
                headerId={`${id}-header`}
                instructionsId={`${id}-instructions`}
              />
              <CurrentSection
                activeDraggableType={activeDraggableType}
                entityCallbacks={entityCallbacks}
                currentBlocks={currentBlocks}
              />
            </DragDropContext>
            {children(drawerCloseCallback, pendingBlock)}
          </div>
        )}
      </UIDConsumer>
    </section>
  );
}

ProjectContent.displayName = "ContentBlock.Builder";

ProjectContent.propTypes = {
  project: PropTypes.object,
  contentBlocks: PropTypes.array,
  contentBlocksResponse: PropTypes.object,
  confirm: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  children: PropTypes.func
};

export default withConfirmation(ProjectContent);
