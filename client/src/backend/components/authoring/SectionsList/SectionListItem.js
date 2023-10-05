import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import Tooltip from "global/components/atomic/Tooltip";
import { textsAPI, sectionsAPI } from "api";
import { useApiCallback } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "./styles";

function SectionListItem(props) {
  const {
    entity: section,
    textId,
    startSectionId,
    draggableProps,
    dragHandleProps,
    isDragging,
    innerRef,
    confirm,
    refresh,
    setError
  } = props;

  const { t } = useTranslation();

  const editUrl = lh.link("backendTextSectionEdit", textId, section.id);
  const ingestUrl = lh.link("backendTextSectionIngestEdit", textId, section.id);
  const propertiesUrl = lh.link(
    "backendTextSectionProperties",
    textId,
    section.id
  );

  const updateText = useApiCallback(textsAPI.update);

  const onSetStart = async id => {
    setError(null);
    const res = await updateText(textId, {
      attributes: { startTextSectionId: id }
    });
    if (res?.errors) setError(res.errors);
  };

  const isStart = startSectionId === section.id;

  const deleteSection = useApiCallback(sectionsAPI.destroy);

  const doDelete = async () => {
    setError(null);
    const res = await deleteSection(section.id);
    if (res?.errors) setError(res.errors);
    refresh();
  };

  const onDelete = () => {
    const heading = t("modals.delete_text");
    const message = t("modals.confirm_body");
    if (confirm) confirm(heading, message, doDelete);
  };

  return section ? (
    <Styled.Item ref={innerRef} {...draggableProps}>
      <Styled.Inner $isDragging={isDragging}>
        <Styled.ButtonGroup>
          <Tooltip
            content={t("texts.section.start_tooltip_content")}
            xOffset="-100px"
            yOffset="43px"
          >
            <Styled.Button onClick={() => onSetStart(section.id)}>
              <Utility.IconComposer size={24} icon="playOutline24" />
            </Styled.Button>
          </Tooltip>
          <Styled.Button onClick={onDelete} aria-label={t("actions.delete")}>
            <Utility.IconComposer size={24} icon="delete24" />
          </Styled.Button>
          <Tooltip
            content={"Edit section in Manifold editor."}
            xOffset="-100px"
            yOffset="43px"
          >
            <Styled.Button
              as={Link}
              to={editUrl}
              aria-label={t("actions.edit")}
            >
              <Utility.IconComposer size={24} icon="annotate24" />
            </Styled.Button>
          </Tooltip>
          <Styled.Button
            as={Link}
            to={propertiesUrl}
            aria-label={t("common.settings")}
          >
            <Utility.IconComposer size={24} icon="settings32" />
          </Styled.Button>
          <Tooltip
            content={"Reingest section from source document."}
            xOffset="-100px"
            yOffset="43px"
          >
            <Styled.Button
              as={Link}
              to={ingestUrl}
              aria-label={t("actions.ingest")}
            >
              <Utility.IconComposer size={24} icon="export24" />
            </Styled.Button>
          </Tooltip>
          <Styled.DragHandle as="div" {...dragHandleProps}>
            <Utility.IconComposer size={30} icon="grabber32" />
          </Styled.DragHandle>
        </Styled.ButtonGroup>
        <Styled.TitleWrapper>
          <Styled.Title>{section.name}</Styled.Title>
          {isStart && (
            <Styled.Tag>{t("texts.section.start_tag_label")}</Styled.Tag>
          )}
        </Styled.TitleWrapper>
        <Styled.BG $isDragging={isDragging} />
      </Styled.Inner>
    </Styled.Item>
  ) : null;
}

SectionListItem.displayName = "Text.Sections.List.Item";

SectionListItem.propTypes = {
  entity: PropTypes.object,
  dragHandleProps: PropTypes.object,
  draggableProps: PropTypes.object,
  isDragging: PropTypes.bool,
  innerRef: PropTypes.func,
  textId: PropTypes.string.isRequired,
  startSectionId: PropTypes.string.isRequired,
  confirm: PropTypes.func,
  refresh: PropTypes.func
};

export default withConfirmation(SectionListItem);
