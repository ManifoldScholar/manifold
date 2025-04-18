import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import IconComposer from "global/components/utility/IconComposer";
import PopoverMenu from "global/components/popover/Menu";
import * as Styled from "./styles";
import { useTranslation } from "react-i18next";

export default function Section({
  section,
  onDelete,
  index,
  sectionCount,
  isDragging,
  setSectionOrder
}) {
  const popoverDisclosureRef = useRef(null);

  const { t } = useTranslation();

  const handleDelete = e => {
    e.preventDefault();
    onDelete(section.id);
  };

  return (
    <>
      <Draggable draggableId={section.id} index={index}>
        {(provided, snapshot) => (
          <Styled.Section
            ref={provided.innerRef}
            {...provided.draggableProps}
            $dragging={snapshot.isDragging}
          >
            <span>{section.name}</span>
            <Styled.ButtonGroup>
              <Styled.Button onClick={handleDelete}>
                <IconComposer icon="delete32" size={24} />
              </Styled.Button>
              <Styled.DragHandle
                as="div"
                {...provided.dragHandleProps}
                tabIndex={-1}
              >
                <IconComposer icon="grabber32" size={24} />
              </Styled.DragHandle>
              <Styled.KeyboardButtons>
                <PopoverMenu
                  disclosure={
                    <Styled.Button ref={popoverDisclosureRef}>
                      <IconComposer icon="arrowUpDown32" size={24} />
                      <span className="screen-reader-text">
                        {t("actions.dnd.reorder")}
                      </span>
                    </Styled.Button>
                  }
                  actions={[
                    {
                      id: "up",
                      label: t("actions.dnd.move_up_position"),
                      onClick: () => {
                        const result = {
                          draggableId: section.id,
                          destination: {
                            index: index - 1
                          },
                          title: section.name,
                          announce: true,
                          callback: () => {
                            if (popoverDisclosureRef.current) {
                              popoverDisclosureRef.current.focus();
                            }
                          }
                        };
                        setSectionOrder(result);
                      },
                      disabled: index === 0
                    },
                    {
                      id: "down",
                      label: t("actions.dnd.move_down_position"),
                      onClick: () => {
                        const result = {
                          draggableId: section.id,
                          destination: {
                            index: index + 1
                          },
                          title: section.name,
                          announce: true,
                          callback: () => {
                            if (popoverDisclosureRef.current) {
                              popoverDisclosureRef.current.focus();
                            }
                          }
                        };
                        setSectionOrder(result);
                      },
                      disabled: index === sectionCount - 1
                    }
                  ]}
                />
              </Styled.KeyboardButtons>
            </Styled.ButtonGroup>
          </Styled.Section>
        )}
      </Draggable>
      {isDragging && (
        <Styled.Section className="drag-placeholder">
          <span>{section.name}</span>
          <Styled.ButtonGroup>
            <Styled.Button as="div">
              <IconComposer icon="delete32" size={24} />
            </Styled.Button>
            <Styled.DragHandle as="div">
              <IconComposer icon="grabber32" size={24} />
            </Styled.DragHandle>
          </Styled.ButtonGroup>
        </Styled.Section>
      )}
    </>
  );
}

Section.displayName = "CreateTextForm.Sections.ListItem";

Section.propTypes = {
  section: PropTypes.exact({ id: PropTypes.string, name: PropTypes.string }),
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool,
  setSectionOrder: PropTypes.func.isRequired,
  sectionCount: PropTypes.number.isRequired
};
