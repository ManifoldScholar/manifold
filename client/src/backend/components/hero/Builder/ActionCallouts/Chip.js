import { useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import DropEdgeIndicator from "global/components/dnd/DropEdgeIndicator";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import { useReorderableItem } from "hooks";

export default function Chip({
  actionCallout,
  index,
  instanceId,
  slotId,
  model,
  actionCalloutEditRoute,
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

  const { setElement, setHandle, isDragging, closestEdge } = useReorderableItem(
    {
      instanceId,
      itemId: id,
      idKey: "calloutId",
      dragData: { calloutId: id, slotId, index },
      dropData: { type: "chip", calloutId: id, slotId, index }
    }
  );

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
        // refs are unreliable here due to rerendering caused by ancestor components
        const disclosureToggleEl = document.querySelector(
          `[data-disclosure-toggle-for="${chipId}"]`
        );
        if (disclosureToggleEl) {
          disclosureToggleEl.focus();
        }
      }
    });
  };

  return (
    <div
      ref={setElement}
      className={classNames({
        "action-callout-slot__chip": true,
        "action-callout-slot__chip--is-dragging": isDragging
      })}
    >
      <DropEdgeIndicator
        edge={closestEdge}
        baseClass="action-callout-slot__chip-drop-indicator"
      />
      <div className="action-callout-slot__chip-inner">
        <button
          onClick={onEdit}
          type="button"
          className="action-callout-slot__button"
        >
          <span className="action-callout-slot__chip-title">{title}</span>
        </button>
        <span className="action-callout-slot__chip-utility">
          <div
            ref={setHandle}
            className="action-callout-slot__button action-callout-slot__button--draggable"
            tabIndex={-1}
            aria-hidden
          >
            <Utility.IconComposer icon="grabber32" size={24} />
            <span className="screen-reader-text">
              {t("actions.dnd.drag_and_drop")}
            </span>
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
      </div>
    </div>
  );
}

Chip.displayName = "Hero.Builder.ActionCallouts.Chip";

Chip.propTypes = {
  actionCallout: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  slotId: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  actionCalloutEditRoute: PropTypes.string.isRequired,
  chipCount: PropTypes.number,
  slotIndex: PropTypes.number,
  slotCount: PropTypes.number,
  onKeyboardMove: PropTypes.func
};
