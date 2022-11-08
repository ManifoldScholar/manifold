import React, { useContext } from "react";
import PropTypes from "prop-types";
import { DragOverContext } from "./dragContext";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function TOCEntry({
  item,
  depth,
  innerRef,
  draggableProps,
  dragHandleProps,
  isDragging,
  setCombine,
  combine,
  textId,
  onDelete
}) {
  const { t } = useTranslation();
  const active = useContext(DragOverContext);

  if (isDragging) {
    setCombine(combine);
  }

  const editUrl = lh.link("backendTextSectionsEdit", textId, "id");

  return (
    <Styled.Item ref={innerRef} {...draggableProps}>
      <Styled.Inner
        $isDragging={isDragging}
        $depth={depth}
        $isTarget={active === item.id}
      >
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
        <Styled.TitleWrapper>
          {!!depth && <Styled.ChildLink icon="tocLink16" />}
          <Styled.Title>{item.data ? item.data.title : ""}</Styled.Title>
        </Styled.TitleWrapper>
        <Styled.BG $isDragging={isDragging} />
      </Styled.Inner>
    </Styled.Item>
  );
}

TOCEntry.displayName = "Text.TOC.List.Entry";

TOCEntry.propTypes = {
  item: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  innerRef: PropTypes.func,
  draggableProps: PropTypes.object,
  dragHandleProps: PropTypes.object,
  isDragging: PropTypes.bool,
  setCombine: PropTypes.func,
  combine: PropTypes.string,
  textId: PropTypes.string,
  onDelete: PropTypes.func
};
