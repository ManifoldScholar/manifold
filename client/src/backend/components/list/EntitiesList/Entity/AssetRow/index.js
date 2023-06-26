import React from "react";
import PropTypes from "prop-types";
import EntityThumbnail from "global/components/entity-thumbnail";
import Utility from "global/components/utility";
import EntityRow from "../Row";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

const fileNameToResourceKind = fileName => {
  const ext = fileName.split(".").pop();

  switch (ext.toLowerCase()) {
    case "gif":
    case "jpeg":
    case "jpg":
    case "png":
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

export default function AssetRow({ entity: asset, onDelete, onEdit, ...rest }) {
  const { t } = useTranslation();

  const {
    sourceIdentifier,
    displayName,
    attachmentData: {
      metadata: { filename, mimeType }
    }
  } = asset?.attributes ?? {};

  const src = `/api/proxy/ingestion_sources/${asset.id}`;

  const figure = (
    <Styled.IconWrapper>
      <EntityThumbnail.Asset
        entity={asset}
        icon={fileNameToResourceKind(filename)}
        isImage={mimeType.includes("image")}
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
        title={t("backend.actions.publish_feature")}
      >
        <Utility.IconComposer icon="delete32" size={26} />
      </button>
      <button
        className="entity-row__utility-button"
        onClick={() => onEdit(asset.id)}
        title={t("backend.actions.publish_feature")}
      >
        <Utility.IconComposer icon="annotate32" size={26} />
      </button>
    </Styled.ButtonGroup>
  );

  const rowProps = {
    title: displayName ?? sourceIdentifier,
    subtitle: <Styled.TruncateURL>{src}</Styled.TruncateURL>,
    figure,
    figureHasWrapper: true,
    label: fileNameToResourceKind(filename),
    ...rest
  };

  return <EntityRow utility={utility} {...rowProps} />;
}

AssetRow.displayName = "EntitiesList.Entity.PendingEntitlementRow";

AssetRow.propTypes = {
  entity: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};
