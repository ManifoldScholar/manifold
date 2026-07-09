import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import PopoverMenu from "global/components/popover/Menu";
import * as Styled from "./styles";

export default function TOCEntry({
  entry,
  depth,
  dragHandleRef,
  disclosureRef,
  moveActions,
  isDragging,
  isTarget,
  targetBlocked,
  textId,
  onDelete,
  onToggle
}) {
  const { t } = useTranslation();

  const editUrl = lh.link("backendTextTOCEntryEdit", textId, entry.id);

  const icon = entry.isExpanded ? "DisclosureUp32" : "DisclosureDown32";

  return (
    <Styled.Inner
      $isDragging={isDragging}
      $depth={depth}
      $isTarget={isTarget}
      $targetBlocked={targetBlocked}
    >
      <Styled.ButtonGroup>
        <Styled.Button
          onClick={() => onDelete(entry.id)}
          aria-label={t("actions.delete")}
        >
          <Utility.IconComposer size={24} icon="delete24" />
        </Styled.Button>
        <Styled.Button as={Link} to={editUrl} aria-label={t("actions.edit")}>
          <Utility.IconComposer size={24} icon="annotate24" />
        </Styled.Button>
        <Styled.DragHandle
          as="div"
          ref={dragHandleRef}
          tabIndex={-1}
          aria-hidden
        >
          <Utility.IconComposer size={30} icon="grabber32" />
          <span className="screen-reader-text">
            {t("actions.dnd.drag_and_drop")}
          </span>
        </Styled.DragHandle>
        <Styled.KeyboardButtons>
          <PopoverMenu
            disclosure={
              <Styled.Button
                ref={disclosureRef}
                data-disclosure-toggle-for={entry.id}
              >
                <Utility.IconComposer icon="arrowUpDown32" size={24} />
                <span className="screen-reader-text">
                  {t("actions.dnd.reorder")}
                </span>
              </Styled.Button>
            }
            actions={moveActions}
          />
        </Styled.KeyboardButtons>
      </Styled.ButtonGroup>
      <Styled.TitleWrapper>
        {entry.hasChildren && (
          <Styled.Button
            onClick={() => onToggle(entry.id, !entry.isExpanded)}
            aria-expanded={entry.isExpanded}
            aria-label={t(
              entry.isExpanded
                ? "texts.toc.collapse_label"
                : "texts.toc.expand_label"
            )}
            style={{ marginBlockStart: "2px" }}
          >
            <Utility.IconComposer size={28} icon={icon} />
          </Styled.Button>
        )}
        <Styled.Title>{entry.data ? entry.data.title : ""}</Styled.Title>
        {!!depth && <Styled.ChildLink />}
      </Styled.TitleWrapper>
    </Styled.Inner>
  );
}

TOCEntry.displayName = "Text.TOC.List.Entry";

TOCEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  dragHandleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  disclosureRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  moveActions: PropTypes.array,
  isDragging: PropTypes.bool,
  isTarget: PropTypes.bool,
  targetBlocked: PropTypes.bool,
  textId: PropTypes.string,
  onDelete: PropTypes.func,
  onToggle: PropTypes.func
};
