import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import * as Styled from "./styles";

export default function SectionListItem(props) {
  const {
    entity: section,
    textId,
    draggableProps,
    dragHandleProps,
    isDragging,
    innerRef,
    onDelete
  } = props;
  const { t } = useTranslation();

  const editUrl = lh.link("backendTextSectionsEdit", textId, section.id);

  return section ? (
    <Styled.Item ref={innerRef} {...draggableProps}>
      <Styled.Inner $isDragging={isDragging}>
        <Styled.ButtonGroup>
          <Styled.Button onClick={onDelete} aria-label={t("actions.delete")}>
            <Utility.IconComposer size={24} icon="delete24" />
          </Styled.Button>
          <Styled.Button as={Link} to={editUrl} aria-label={t("actions.edit")}>
            <Utility.IconComposer size={24} icon="annotate24" />
          </Styled.Button>
          <Styled.DragHandle {...dragHandleProps}>
            <Utility.IconComposer size={30} icon="grabber32" />
          </Styled.DragHandle>
        </Styled.ButtonGroup>
        <Styled.Title>{section.name}</Styled.Title>
        <Styled.BG $isDragging={isDragging} />
      </Styled.Inner>
    </Styled.Item>
  ) : null;
}

SectionListItem.displayName = "Text.Sections.List.Item";

SectionListItem.propTypes = {
  section: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dragHandleProps: PropTypes.object,
  draggableProps: PropTypes.object,
  isDragging: PropTypes.bool,
  innerRef: PropTypes.func
};
