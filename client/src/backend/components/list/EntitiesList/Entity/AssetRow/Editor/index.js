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
    <li>
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
        <Styled.Title>{displayName ?? sourceIdentifier}</Styled.Title>
      </Styled.Asset>
    </li>
  );
}
