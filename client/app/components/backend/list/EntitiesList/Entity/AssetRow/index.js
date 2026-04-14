import React from "react";
import PropTypes from "prop-types";
import EntityThumbnail from "global/components/entity-thumbnail";
import Utility from "global/components/utility";
import EntityRow from "../Row";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

const extToTag = ext => {
  switch (ext?.toLowerCase()) {
    case "gif":
    case "jpeg":
    case "jpg":
    case "png":
    case "svg":
      return "image";
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
    case "txt":
    case "odt":
    case "xhtml":
    case "css":
      return "document";
    case "mp3":
    case "flac":
    case "wav":
    case "ogg":
    case "oga":
      return "audio";
    case "mp4":
    case "webm":
    case "flv":
    case "mov":
    case "avi":
      return "video";
    default:
      return "file";
  }
};

export default function AssetRow({
  entity: asset,
  onDelete,
  onEdit,
  isBrowse,
  active,
  onRowClick,
  ...rest
}) {
  const { t } = useTranslation();

  const {
    sourceIdentifier,
    displayName,
    attachmentExtension,
    attachmentContentType
  } = asset?.attributes ?? {};

  const src = `/api/proxy/ingestion_sources/${asset.id}`;

  const figure = (
    <Styled.IconWrapper>
      <EntityThumbnail.Asset
        entity={asset}
        icon={extToTag(attachmentExtension)}
        isImage={attachmentContentType.includes("image")}
      />
    </Styled.IconWrapper>
  );

  const onCopy = e => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(src);
    }
  };

  const utility = (
    <Styled.ButtonGroup>
      <Styled.CopyButton
        onClick={onCopy}
        className="entity-row__utility button-lozenge-secondary"
      >
        <Styled.CopyLabel>
          {t("texts.assets.copy_button_label")}
        </Styled.CopyLabel>
        <Styled.CopyLabelMobile>{t("actions.copy")}</Styled.CopyLabelMobile>
      </Styled.CopyButton>
      <button
        className="entity-row__utility-button"
        onClick={() => onDelete(asset.id)}
        aria-label={t("actions.delete")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
      <button
        className="entity-row__utility-button"
        onClick={() => onEdit(asset.id)}
        aria-label={t("actions.edit")}
      >
        <Utility.IconComposer icon="annotate32" size={26} />
      </button>
    </Styled.ButtonGroup>
  );

  const onClick = e => {
    e.preventDefault();
    if (onRowClick) onRowClick(asset);
  };

  const rowProps = {
    title: <Styled.Truncate>{displayName ?? sourceIdentifier}</Styled.Truncate>,
    subtitle: !isBrowse ? <Styled.Truncate>{src}</Styled.Truncate> : undefined,
    figure,
    figureHasWrapper: true,
    label: !isBrowse ? extToTag(attachmentExtension) : undefined,
    onRowClick: onRowClick ? onClick : undefined,
    ...rest
  };

  return (
    <EntityRow
      utility={!isBrowse ? utility : undefined}
      active={active === asset.id}
      {...rowProps}
    />
  );
}

AssetRow.displayName = "EntitiesList.Entity.AssetRow";

AssetRow.propTypes = {
  entity: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};
