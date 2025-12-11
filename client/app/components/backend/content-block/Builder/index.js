import { useState, useEffect, useRef, useId } from "react";
import PropTypes from "prop-types";
import { useNavigate, useRevalidator } from "react-router";
import { useTranslation } from "react-i18next";
import AvailableSection from "./sections/Available";
import CurrentSection from "./sections/Current";
import DraggableEventHelper from "../helpers/draggableEvent";
import resolver from "../helpers/resolver";
import { contentBlocksAPI } from "api";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import withConfirmation from "components/hoc/withConfirmation";
import ClientOnly from "components/global/utility/ClientOnly";
import configHelper from "../helpers/configurations";
import { cloneDeep } from "lodash-es";
import { useApiCallback } from "hooks";

const cloneBlocks = contentBlocks => {
  const blocks = contentBlocks || [];
  return cloneDeep(blocks);
};

const isTopType = type => resolver.typeToBlockComponent(type).top === true;

const zoneBlocks = (blocks, zoneType) =>
  blocks.filter(
    block => isTopType(block.attributes.type) === (zoneType === "TOP")
  );

function ProjectContent({ project, contentBlocks, confirm, children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [blocks, setBlocks] = useState(cloneBlocks(contentBlocks));
  const [activeDraggableType, setActiveDraggableType] = useState(null);
  const [instanceId] = useState(() => Symbol("contentBlockBuilder"));

  useEffect(() => {
    setBlocks(prev => {
      const hadPending = prev.some(b => b.id === "pending");
      if (hadPending) {
        // Preserve the pending block; update only the non-pending blocks
        const pending = prev.find(b => b.id === "pending");
        const pendingIndex = prev.indexOf(pending);
        const updated = cloneBlocks(contentBlocks);
        updated.splice(pendingIndex, 0, pending);
        return updated;
      }
      return cloneBlocks(contentBlocks);
    });
  }, [contentBlocks]);

  const pendingBlock = blocks.find(block => block.id === "pending");

  const createContentBlock = useApiCallback(contentBlocksAPI.create);

  const updateContentBlock = useApiCallback(contentBlocksAPI.update);

  const deleteContentBlock = useApiCallback(contentBlocksAPI.destroy);

  const createBlock = async blockToCreate => {
    const block = blockToCreate || pendingBlock;
    await createContentBlock(project.id, block);
    revalidate();
  };

  const updateBlock = async (block, callback) => {
    await updateContentBlock(block.id, {
      attributes: block.attributes
    });
    revalidate();
    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const newBlock = blockToCreate => {
    const block = blockToCreate || pendingBlock;
    if (configHelper.isConfigurable(block?.attributes.type)) {
      navigate(`/backend/projects/${project.id}/layout/content-blocks/new`);
    } else {
      createBlock(block);
    }
  };

  const dropStateRef = useRef();
  dropStateRef.current = { blocks, updateBlock, newBlock };

  // Translate a native drop into the rbd-shaped event DraggableEventHelper
  // consumes, so the (top/bottom, insert/move) position math is preserved.
  const handleDrop = ({ source, location }) => {
    setActiveDraggableType(null);

    const {
      blocks: currentBlocks,
      updateBlock: update,
      newBlock: insert
    } = dropStateRef.current;
    const targets = location.current.dropTargets;
    const zoneTarget = targets.find(dt => dt.data.kind === "zone");
    const blockTarget = targets.find(dt => dt.data.kind === "current-block");
    const destinationZone =
      zoneTarget?.data.zoneType ?? blockTarget?.data.zoneType;
    if (!destinationZone) return;

    const destZoneBlocks = zoneBlocks(currentBlocks, destinationZone);
    let index;
    if (blockTarget) {
      const rawIndex = destZoneBlocks.findIndex(
        b => b.id === blockTarget.data.id
      );
      if (rawIndex === -1) return;
      const edge = extractClosestEdge(blockTarget.data);
      index = edge === "bottom" ? rawIndex + 1 : rawIndex;
    } else {
      index = destZoneBlocks.length;
    }

    const isMove = source.data.kind === "current";
    if (isMove && source.data.zoneType === destinationZone) {
      if (source.data.index < index) index -= 1;
      if (source.data.index === index) return;
    }

    const zone = destinationZone.toLowerCase();
    const draggable = isMove
      ? {
          type: source.data.zoneType,
          draggableId: source.data.id,
          source: {
            droppableId: `current-${source.data.zoneType.toLowerCase()}`
          },
          destination: { droppableId: `current-${zone}`, index }
        }
      : {
          type: source.data.zoneType,
          draggableId: source.data.blockType,
          source: { droppableId: `available-${source.data.blockType}` },
          destination: { droppableId: `current-${zone}`, index }
        };

    const draggableHelper = new DraggableEventHelper(draggable, currentBlocks);
    if (!draggableHelper.actionable) return;
    const action = draggableHelper.action;
    const newBlocks = draggableHelper.blocks;
    setBlocks(newBlocks);
    if (action === "move") update(draggableHelper.block);
    if (action === "insert") {
      const newPendingBlock = newBlocks.find(block => block.id === "pending");
      insert(newPendingBlock);
    }
  };
  const handleDropRef = useRef(handleDrop);
  handleDropRef.current = handleDrop;

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.instanceId === instanceId,
        onDragStart: ({ source }) =>
          setActiveDraggableType(source.data.zoneType),
        onDrop: args => handleDropRef.current(args)
      }),
      autoScrollWindowForElements()
    );
  }, [instanceId]);

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
    setBlocks(cloneBlocks(contentBlocks));
  };

  const editBlock = block => {
    navigate(
      `/backend/projects/${project.id}/layout/content-blocks/${block.id}`,
      {
        state: { noScroll: true }
      }
    );
  };

  const deleteBlock = async block => {
    await deleteContentBlock(block.id);
    revalidate();
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

  const clearPendingBlock = pendingBlock ? resetState : null;

  const id = useId();

  return (
    <section className="backend-project-content">
      <div
        className="form-secondary"
        role="group"
        aria-labelledby={`${id}-header`}
        aria-describedby={`${id}-instructions`}
      >
        <ClientOnly>
          <AvailableSection
            onClickAdd={handleAddEntity}
            currentBlocks={blocks}
            instanceId={instanceId}
            headerId={`${id}-header`}
            instructionsId={`${id}-instructions`}
          />
          <CurrentSection
            activeDraggableType={activeDraggableType}
            entityCallbacks={entityCallbacks}
            currentBlocks={blocks}
            instanceId={instanceId}
          />
          {children(clearPendingBlock, pendingBlock)}
        </ClientOnly>
      </div>
    </section>
  );
}

ProjectContent.displayName = "ContentBlock.Builder";

ProjectContent.propTypes = {
  project: PropTypes.object,
  contentBlocks: PropTypes.array,
  confirm: PropTypes.func.isRequired,
  children: PropTypes.func
};

export default withConfirmation(ProjectContent);
