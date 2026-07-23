import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./parts/Header";
import resolver from "../../helpers/resolver";
import Block from "../Block";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classNames from "classnames";
import { withTranslation } from "react-i18next";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { useFocusAfterRemoval } from "hooks";

const isTopBlock = block =>
  resolver.typeToBlockComponent(block.attributes.type).top === true;

function Zone({ zoneType, instanceId, showDropzone, children }) {
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return undefined;

    return dropTargetForElements({
      element,
      canDrop: ({ source }) =>
        source.data.instanceId === instanceId &&
        source.data.zoneType === zoneType,
      getData: () => ({ kind: "zone", zoneType })
    });
  }, [element, instanceId, zoneType]);

  return (
    <div
      ref={setElement}
      className={classNames("content-block-list full-width", {
        "content-block-list--show-dropzone": showDropzone
      })}
    >
      {children}
    </div>
  );
}

Zone.propTypes = {
  zoneType: PropTypes.string.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  showDropzone: PropTypes.bool,
  children: PropTypes.node
};

function ProjectContentSectionsCurrent({
  currentBlocks = [],
  entityCallbacks,
  activeDraggableType,
  instanceId,
  setScreenReaderStatus,
  renderLiveRegion,
  t
}) {
  const topBlocks = currentBlocks.filter(isTopBlock);
  const bottomBlocks = currentBlocks.filter(block => !isTopBlock(block));

  const zones = {
    top: { blocks: topBlocks, visible: false },
    bottom: { blocks: bottomBlocks, visible: true }
  };

  /* Blocks render as divs across two zones; the hook resolves neighbors by
     document order, so the item list has to be zone-ordered too. */
  const { listRef, rememberRemoval } = useFocusAfterRemoval(
    [...topBlocks, ...bottomBlocks],
    { itemSelector: ".backend-content-block--current" }
  );

  const bindEntityCallbacks = block => {
    const bound = Object.keys(entityCallbacks).reduce((memo, key) => {
      return {
        ...memo,
        [key]: addtlParams => entityCallbacks[key](block, addtlParams)
      };
    }, {});

    return {
      ...bound,
      deleteBlock: addtlParams => {
        rememberRemoval(block.id);
        bound.deleteBlock(addtlParams);
      }
    };
  };

  const showDropzone = zone => {
    if (activeDraggableType === zone.toUpperCase()) return true;
    return zones[zone].visible && zones[zone].blocks.length === 0;
  };

  return (
    <>
      <div ref={listRef} tabIndex={-1}>
        <Header subtitle={t("layout.layout")} />
        {Object.keys(zones).map(zone => (
          <Zone
            key={zone}
            zoneType={zone.toUpperCase()}
            instanceId={instanceId}
            showDropzone={showDropzone(zone)}
          >
            {zones[zone].blocks.map((block, index) => (
              <Block
                entityCallbacks={bindEntityCallbacks(block)}
                currentBlocks={currentBlocks}
                key={block.id}
                context="current"
                entity={block}
                type={block.attributes.type}
                index={index}
                entityCount={zones[zone].blocks.length}
                instanceId={instanceId}
                announce={setScreenReaderStatus}
              />
            ))}
          </Zone>
        ))}
      </div>
      {renderLiveRegion("alert")}
    </>
  );
}

ProjectContentSectionsCurrent.displayName = "Project.Content.Sections.Current";

ProjectContentSectionsCurrent.propTypes = {
  currentBlocks: PropTypes.array.isRequired,
  entityCallbacks: PropTypes.object.isRequired,
  activeDraggableType: PropTypes.string,
  instanceId: PropTypes.symbol.isRequired,
  setScreenReaderStatus: PropTypes.func,
  renderLiveRegion: PropTypes.func,
  t: PropTypes.func
};

export default withTranslation()(
  withScreenReaderStatus(ProjectContentSectionsCurrent, false)
);
