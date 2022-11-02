import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function SectionListItem(props) {
  const {
    entity,
    draggableProps,
    dragHandleProps,
    isDragging,
    innerRef,
    onEdit,
    onDelete
  } = props;
  const { t } = useTranslation();

  return entity ? (
    <Styled.Item ref={innerRef} {...draggableProps}>
      <Styled.Inner $isDragging={isDragging}>
        <Styled.Title>{entity.attributes.title}</Styled.Title>
        <Styled.ButtonGroup>
          <Styled.Button onClick={onDelete} aria-label={t("actions.delete")}>
            <Utility.IconComposer size={24} icon="delete24" />
          </Styled.Button>
          <Styled.Button onClick={onEdit} aria-label={t("actions.edit")}>
            <Utility.IconComposer size={24} icon="annotate24" />
          </Styled.Button>
          <Styled.DragHandle {...dragHandleProps}>
            <Utility.IconComposer size={30} icon="grabber32" />
          </Styled.DragHandle>
        </Styled.ButtonGroup>
      </Styled.Inner>
    </Styled.Item>
  ) : null;
}

SectionListItem.displayName = "Text.Sections.List.Item";

SectionListItem.propTypes = {
  entity: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dragHandleProps: PropTypes.object,
  draggableProps: PropTypes.object,
  isDragging: PropTypes.bool,
  innerRef: PropTypes.func
};
