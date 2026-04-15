import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import { Droppable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import Chip from "./Chip";

export default function Slot({
  title,
  attributes,
  actionCallouts,
  id,
  model,
  actionCalloutEditRoute,
  actionCalloutNewRoute,
  index,
  slotCount,
  onKeyboardMove
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openNewDrawer = () => {
    const actionCallout = { attributes };
    navigate(lh.link(actionCalloutNewRoute, model.id), {
      state: { noScroll: true, actionCallout }
    });
  };

  return (
    <Droppable droppableId={id} type="actionCallout">
      {(provided, snapshot) => (
        <div
          className={classNames("action-callout-slot", {
            "action-callout-slot--active": snapshot.isDraggingOver
          })}
        >
          <div className="action-callout-slot__content">
            <button
              type="button"
              onClick={openNewDrawer}
              className="action-callout-slot__button action-callout-slot__button--header"
            >
              <Utility.IconComposer icon="circlePlus32" size={32} />
              <span>
                {t(title)}
                <br />
                {attributes.button ? t("layout.buttons") : t("layout.links")}
              </span>
            </button>
            <div ref={provided.innerRef} className="action-callout-slot__chips">
              {actionCallouts.map((actionCallout, chipIndex) => (
                <Chip
                  key={actionCallout.id}
                  actionCalloutEditRoute={actionCalloutEditRoute}
                  index={chipIndex}
                  actionCallout={actionCallout}
                  model={model}
                  isDragging={
                    snapshot.draggingFromThisWith === actionCallout.id
                  }
                  chipCount={actionCallouts.length}
                  slotIndex={index}
                  slotCount={slotCount}
                  onKeyboardMove={onKeyboardMove}
                />
              ))}
              {provided.placeholder}
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
}

Slot.displayName = "Hero.Builder.ActionCallouts.Slot";

Slot.propTypes = {
  title: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  actionCallouts: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  actionCalloutEditRoute: PropTypes.string.isRequired,
  actionCalloutNewRoute: PropTypes.string.isRequired,
  index: PropTypes.number,
  slotCount: PropTypes.number,
  onKeyboardMove: PropTypes.func
};
