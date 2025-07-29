import EntityThumbnail from "global/components/entity-thumbnail";
import * as Styled from "./styles";

export default function EditorAssetRow({
  entity: asset,
  active,
  onRowClick,
  format
}) {
  const { sourceIdentifier, displayName, attachmentContentType } =
    asset?.attributes ?? {};

  const onClick = e => {
    e.preventDefault();
    if (onRowClick) onRowClick(asset);
  };

  return (
    <Styled.Asset
      className="entity-row entity-list__entity"
      $active={active === asset?.id}
      onClick={onClick}
    >
      <Styled.IconWrapper>
        <EntityThumbnail.Asset
          entity={asset}
          icon={format}
          isImage={attachmentContentType.includes("image")}
        />
      </Styled.IconWrapper>
      <span>{displayName ?? sourceIdentifier}</span>
    </Styled.Asset>
  );
}
