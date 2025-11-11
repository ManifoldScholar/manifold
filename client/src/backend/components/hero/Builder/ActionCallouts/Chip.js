import { useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import lh from "helpers/linkHandler";
import classNames from "classnames";

export default function Chip({
  actionCallout,
  index,
  model,
  actionCalloutEditRoute,
  isDragging,
  chipCount,
  slotIndex,
  slotCount,
  onKeyboardMove
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const popoverDisclosureRef = useRef(null);

  const modelId = model.id;
  const title = actionCallout.attributes.title;
  const id = actionCallout.id;
  const chipId = `chip-${id}`;

  const onEdit = event => {
    event.preventDefault();
    navigate(lh.link(actionCalloutEditRoute, modelId, id), {
      state: { noScroll: true }
    });
  };

  const handleKeyboardMove = direction => {
    onKeyboardMove({
      callout: actionCallout,
      index,
      slotIndex,
      direction,
      callback: () => {
        // refs are unreliably here due to rerendering caused by ancestor components
        const disclosureToggleEl = document.querySelector(
          `[data-disclosure-toggle-for="${chipId}"]`
        );
        if (disclosureToggleEl) {
          disclosureToggleEl.focus();
        }
      }
    });
  };

  const renderUtility = provided => {
    return (
      <span className="action-callout-slot__chip-utility">
        <div
          className="action-callout-slot__button action-callout-slot__button--draggable"
          {...provided.dragHandleProps}
          tabIndex={-1}
        >
          <Utility.IconComposer icon="grabber32" size={24} />
        </div>
        <div className="action-callout-slot__utility-keyboard-buttons">
          <PopoverMenu
            disclosure={
              <button
                ref={popoverDisclosureRef}
                data-disclosure-toggle-for={chipId}
                className="action-callout-slot__button"
              >
                <Utility.IconComposer icon="arrowCardinals32" size={24} />
                <span className="screen-reader-text">
                  {t("actions.dnd.reorder")}
                </span>
              </button>
            }
            actions={[
              {
                id: "up",
                label: t("actions.dnd.move_up_position"),
                onClick: () => handleKeyboardMove("up"),
                disabled: index === 0
              },
              {
                id: "down",
                label: t("actions.dnd.move_down_position"),
                onClick: () => handleKeyboardMove("down"),
                disabled: index === chipCount - 1
              },
              {
                id: "left",
                label: t("actions.dnd.move_left_group"),
                onClick: () => handleKeyboardMove("left"),
                disabled: slotIndex === 0
              },
              {
                id: "right",
                label: t("actions.dnd.move_right_group"),
                onClick: () => handleKeyboardMove("right"),
                disabled: slotIndex === slotCount - 1
              }
            ]}
          />
        </div>
      </span>
    );
  };

  return (
    <>
      <Draggable index={index} draggableId={id} key={id} type="actionCallout">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={classNames({
              "action-callout-slot__chip": true,
              "action-callout-slot__chip--is-dragging": snapshot.isDragging
            })}
          >
            <div className="action-callout-slot__chip-inner">
              <button
                onClick={onEdit}
                type="button"
                className="action-callout-slot__button"
              >
                <span className="action-callout-slot__chip-title">{title}</span>
              </button>
              {renderUtility(provided)}
            </div>
          </div>
        )}
      </Draggable>
      {isDragging && (
        <div
          className={classNames(
            "action-callout-slot__chip",
            "drag-placeholder"
          )}
        >
          <div className="action-callout-slot__chip-inner">
            <span className="action-callout-slot__button">
              <span className="action-callout-slot__chip-title">{title}</span>
            </span>
            <span className="action-callout-slot__chip-utility">
              <div className="action-callout-slot__button action-callout-slot__button--draggable">
                <Utility.IconComposer icon="grabber32" size={24} />
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

Chip.displayName = "Hero.Builder.ActionCallouts.Chip";

Chip.propTypes = {
  actionCallout: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  model: PropTypes.object.isRequired,
  actionCalloutEditRoute: PropTypes.string.isRequired,
  isDragging: PropTypes.bool,
  chipCount: PropTypes.number,
  slotIndex: PropTypes.number,
  slotCount: PropTypes.number,
  onKeyboardMove: PropTypes.func
};
