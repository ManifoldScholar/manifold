import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AvailableSection from "./sections/Available";
import CurrentSection from "./sections/Current";
import DraggableEventHelper from "../helpers/draggableEvent";
import { contentBlocksAPI, projectsAPI, requests } from "api";
import { DragDropContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";
import configHelper from "../helpers/configurations";
import cloneDeep from "lodash/cloneDeep";
import { UIDConsumer } from "react-uid";
import { useFetch, useApiCallback } from "hooks";

const cloneBlocks = contentBlocks => {
  const blocks = contentBlocks || [];
  return cloneDeep(blocks);
};

function ProjectContent({ project, confirm, children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: contentBlocks, refresh } = useFetch({
    request: [projectsAPI.contentBlocks, project?.id],
    options: { requestKey: requests.beProjectContentBlocks },
    condition: !!project?.id
  });

  const [blocks, setBlocks] = useState(() => cloneBlocks(contentBlocks || []));
  const [activeDraggableType, setActiveDraggableType] = useState(null);

  useEffect(() => {
    setBlocks(cloneBlocks(contentBlocks || []));
  }, [contentBlocks]);

  const pendingBlock = blocks.find(block => block.id === "pending");

  const createContentBlock = useApiCallback(contentBlocksAPI.create, {
    requestKey: requests.beContentBlockCreate,
    options: { adds: requests.beProjectContentBlocks }
  });

  const updateContentBlock = useApiCallback(contentBlocksAPI.update, {
    requestKey: requests.beContentBlockUpdate,
    noTouch: true
  });

  const deleteContentBlock = useApiCallback(contentBlocksAPI.destroy, {
    requestKey: requests.beContentBlockDestroy
  });

  const createBlock = async blockToCreate => {
    const block = blockToCreate || pendingBlock;
    await createContentBlock(project.id, block);
    refresh();
  };

  const updateBlock = async (block, callback) => {
    await updateContentBlock(block.id, {
      attributes: block.attributes
    });
    refresh();
    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const newBlock = blockToCreate => {
    const block = blockToCreate || pendingBlock;
    if (configHelper.isConfigurable(block?.attributes.type)) {
      navigate(lh.link("backendProjectContentBlockNew", project.id));
    } else {
      createBlock(block);
    }
  };

  const onDragStart = ({ type }) => {
    setActiveDraggableType(type);
  };

  const onDragEnd = draggable => {
    setActiveDraggableType(null);
    const draggableHelper = new DraggableEventHelper(draggable, blocks);
    if (!draggableHelper.actionable) return;
    const action = draggableHelper.action;
    const newBlocks = draggableHelper.blocks;
    let callback;
    if (action === "move") callback = () => updateBlock(draggableHelper.block);
    if (action === "insert") {
      const newPendingBlock = newBlocks.find(block => block.id === "pending");
      callback = () => newBlock(newPendingBlock);
    }
    setBlocks(newBlocks);
    if (callback) callback();
  };

  const onKeyboardMove = (block, addtlParams) => {
    const { index, direction, callback } = addtlParams;
    const newIndex = direction === "down" ? index + 1 : index - 1;

    const filteredBlocks = blocks.filter(b => b.id !== block.id);
    const updatedBlocks = filteredBlocks.toSpliced(newIndex, 0, block);

    const clonedBlock = cloneDeep(block);
    clonedBlock.attributes.position = newIndex + 1; // position starts from 1, index from 0

    setBlocks(updatedBlocks);
    updateBlock(clonedBlock, callback);
  };

  const resetState = () => {
    setBlocks(cloneBlocks(contentBlocks || []));
  };

  const editBlock = block => {
    navigate(lh.link("backendProjectContentBlock", project.id, block.id), {
      state: { noScroll: true }
    });
  };

  const deleteBlock = async block => {
    await deleteContentBlock(block.id);
    refresh();
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
      blocks
    );
    const newBlocks = draggableHelper.blocks;
    const newPendingBlock = newBlocks.find(block => block.id === "pending");
    setBlocks(newBlocks);
    newBlock(newPendingBlock);
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

  const closeWithoutSave = pendingBlock ? resetState : null;
  const onSave = refresh;

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
                currentBlocks={blocks}
                headerId={`${id}-header`}
                instructionsId={`${id}-instructions`}
              />
              <CurrentSection
                activeDraggableType={activeDraggableType}
                entityCallbacks={entityCallbacks}
                currentBlocks={blocks}
              />
            </DragDropContext>
            {children(closeWithoutSave, onSave, pendingBlock)}
          </div>
        )}
      </UIDConsumer>
    </section>
  );
}

ProjectContent.displayName = "ContentBlock.Builder";

ProjectContent.propTypes = {
  project: PropTypes.object,
  confirm: PropTypes.func.isRequired,
  children: PropTypes.func
};

export default withConfirmation(ProjectContent);
