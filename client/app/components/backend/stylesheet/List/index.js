import { useState } from "react";
import PropTypes from "prop-types";
import {
  DragDropContext,
  Droppable
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Stylesheet from "./Stylesheet";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import ClientOnly from "components/global/utility/ClientOnly";

function StylesheetList({
  text,
  stylesheets: stylesheetsProp,
  callbacks,
  setScreenReaderStatus,
  renderLiveRegion
}) {
  const { t } = useTranslation();

  const [dragging, setDragging] = useState(false);
  const [stylesheets, setStylesheets] = useState(stylesheetsProp);

  const findStylesheet = id => stylesheets.find(ss => ss.id === id);

  const updateInternalState = (stylesheet, index) => {
    setStylesheets(prev => {
      const filtered = prev.filter(ss => ss.id !== stylesheet.id);
      filtered.splice(index, 0, stylesheet);
      return filtered;
    });
  };

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragEnd = draggable => {
    setDragging(false);
    if (!draggable.destination) return;
    const stylesheet = findStylesheet(draggable.draggableId);
    const index = draggable.destination.index;
    if (!stylesheet) return;
    updateInternalState(stylesheet, index);
    callbacks.updatePosition(stylesheet, index + 1);
  };

  const onKeyboardMove = ({ id, title, index, direction, ...rest }) => {
    const stylesheet = findStylesheet(id);
    const newIndex = direction === "down" ? index + 1 : index - 1;

    updateInternalState(stylesheet, newIndex);

    const announcement = t("actions.dnd.moved_to_position", {
      title,
      position: newIndex + 1
    });
    const callback = () => {
      setScreenReaderStatus(announcement);

      if (rest.callback && typeof rest.callback === "function") {
        rest.callback();
      }
    };
    callbacks.updatePosition(stylesheet, newIndex + 1, callback);
  };

  return (
    <>
      <ClientOnly>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <section className="ordered-records rbd-migration-resets">
            <Droppable type="category" droppableId="categories">
              {(provided, snapshot) => (
                <div
                  className={classNames({
                    "ordered-records__dropzone": true,
                    "ordered-records__dropzone--active": dragging
                  })}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {stylesheets.map((stylesheet, index) => (
                    <Stylesheet
                      index={index}
                      text={text}
                      onDestroy={callbacks.confirmDestroy}
                      stylesheet={stylesheet}
                      key={stylesheet.id}
                      isDragging={
                        snapshot.draggingFromThisWith === stylesheet.id
                      }
                      stylesheetCount={stylesheets.length}
                      onKeyboardMove={onKeyboardMove}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        </DragDropContext>
      </ClientOnly>
      {renderLiveRegion("alert")}
    </>
  );
}

StylesheetList.displayName = "Stylesheet.List";

StylesheetList.propTypes = {
  text: PropTypes.object,
  stylesheets: PropTypes.array,
  callbacks: PropTypes.object.isRequired
};

export default withScreenReaderStatus(StylesheetList, false);
