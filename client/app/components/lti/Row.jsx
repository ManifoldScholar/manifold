import { useState } from "react";
import styled from "@emotion/styled";
import EntityThumbnail from "components/global/entity-thumbnail";
import LinkToggle from "components/lti/LinkToggle";
import * as GenericStyled from "components/global/search/results/Types/Generic/styles";
import * as TypeStyled from "components/global/search/results/Types/styles";

const Subtitle = styled.div`
  margin-top: 4px;
  font-family: var(--font-family-sans);
  font-size: 15px;
  font-weight: var(--font-weight-regular);
  color: var(--color-neutral-text-dark);
`;

const CoverWrap = styled.div`
  position: relative;

  .collecting-toggle.collecting-toggle--project-cover {
    top: 6px;
    left: auto;
    right: 6px;
  }
`;

function safeEntity(entity, attachmentKey) {
  const attrs = entity?.attributes ?? {};
  return {
    ...entity,
    attributes: {
      ...attrs,
      [attachmentKey]: attrs[attachmentKey] ?? {}
    }
  };
}

const TEXT_COVER_VARIANTS = [
  "smallPortrait",
  "small",
  "mediumPortrait",
  "medium",
  "original"
];

function Figure({ kind, entity }) {
  if (kind === "textSection") {
    const safe = safeEntity(entity, "coverStyles");
    return (
      <TypeStyled.ThumbnailNarrow
        as={EntityThumbnail.TextSection}
        entity={safe}
        width="100%"
        height={null}
        $isSvg
      />
    );
  }
  if (kind === "text") {
    const safe = safeEntity(entity, "coverStyles");
    const covers = safe.attributes.coverStyles ?? {};
    const variant =
      TEXT_COVER_VARIANTS.find(v => Boolean(covers[v])) ?? "smallPortrait";
    const hasCover = Boolean(covers[variant]);
    return (
      <TypeStyled.ThumbnailNarrow
        entity={safe}
        variant={variant}
        width="100%"
        height={null}
        $isSvg={!hasCover}
      />
    );
  }
  if (kind === "resource") {
    const attrs = entity?.attributes ?? {};
    const safe = {
      ...entity,
      attributes: {
        ...attrs,
        attachmentStyles: attrs.attachmentStyles ?? {},
        variantThumbnailStyles: attrs.variantThumbnailStyles ?? {}
      }
    };
    const hasImg =
      Boolean(safe.attributes.attachmentStyles?.small) ||
      Boolean(safe.attributes.variantThumbnailStyles?.small);
    return (
      <TypeStyled.Thumbnail
        as={EntityThumbnail.Resource}
        entity={safe}
        width="100%"
        height={null}
        $isImg={hasImg}
      />
    );
  }
  const safe = safeEntity(entity, "avatarStyles");
  return (
    <TypeStyled.Thumbnail
      placeholderAttributes={{ mode: "small" }}
      entity={safe}
      width="100%"
      height={null}
      $isImg={
        safe.attributes.avatarStyles?.small ||
        safe.attributes.avatarStyles?.smallSquare
      }
    />
  );
}

function formatKind(attrs) {
  const { kind, subKind } = attrs;
  if (!kind) return null;
  return subKind ? `${kind} · ${subKind}` : kind;
}

export default function LtiRow({
  entity,
  kind,
  to,
  linkState,
  parent,
  description,
  attribution,
  subtitle,
  meta,
  title: titleOverride,
  typeLabel,
  selected = false,
  onToggle,
  as = "li"
}) {
  const attrs = entity?.attributes ?? {};
  const title =
    titleOverride ?? attrs.titlePlaintext ?? attrs.title ?? attrs.name ?? "";
  const [rowHovered, setRowHovered] = useState(false);

  const resolvedSubtitle =
    subtitle ?? attrs.subtitlePlaintext ?? attrs.subtitle ?? null;
  const resolvedAttribution = attribution ?? attrs.creatorNames ?? null;
  const resolvedDescription = description ?? attrs.descriptionPlaintext ?? null;
  const resolvedMeta = meta ?? (kind === "resource" ? formatKind(attrs) : null);

  return (
    <GenericStyled.Result
      as={as}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
      onFocus={() => setRowHovered(true)}
      onBlur={() => setRowHovered(false)}
    >
      <GenericStyled.Inner>
        <GenericStyled.ImageCol>
          <CoverWrap>
            {to ? (
              <GenericStyled.Link
                to={to}
                state={linkState}
                tabIndex={-1}
                aria-hidden
              >
                <GenericStyled.Image>
                  <Figure kind={kind} entity={entity} />
                </GenericStyled.Image>
              </GenericStyled.Link>
            ) : (
              <GenericStyled.Image>
                <Figure kind={kind} entity={entity} />
              </GenericStyled.Image>
            )}
            {onToggle ? (
              <LinkToggle
                inline={false}
                selected={selected}
                onToggle={onToggle}
                hiddenIfUnlinked={!rowHovered}
                srLabel={selected ? `Remove ${title}` : `Add ${title}`}
              />
            ) : null}
          </CoverWrap>
        </GenericStyled.ImageCol>
        <GenericStyled.TextCol>
          <GenericStyled.TextTop>
            <GenericStyled.TextTopLeft>
              {parent?.label ? (
                parent.to ? (
                  <GenericStyled.Link to={parent.to}>
                    <GenericStyled.Parent>{parent.label}</GenericStyled.Parent>
                  </GenericStyled.Link>
                ) : (
                  <GenericStyled.Parent>{parent.label}</GenericStyled.Parent>
                )
              ) : null}
              {to ? (
                <GenericStyled.Link to={to} state={linkState}>
                  <GenericStyled.Title>{title}</GenericStyled.Title>
                  {resolvedSubtitle ? (
                    <Subtitle>{resolvedSubtitle}</Subtitle>
                  ) : null}
                </GenericStyled.Link>
              ) : (
                <>
                  <GenericStyled.Title>{title}</GenericStyled.Title>
                  {resolvedSubtitle ? (
                    <Subtitle>{resolvedSubtitle}</Subtitle>
                  ) : null}
                </>
              )}
              {resolvedAttribution ? (
                <GenericStyled.Attribution>
                  <span>
                    <em>by</em> {resolvedAttribution}
                  </span>
                </GenericStyled.Attribution>
              ) : null}
            </GenericStyled.TextTopLeft>
            <GenericStyled.TextTopRight>
              {typeLabel ? (
                <GenericStyled.Label>{typeLabel}</GenericStyled.Label>
              ) : null}
            </GenericStyled.TextTopRight>
          </GenericStyled.TextTop>
          {resolvedDescription ? (
            <GenericStyled.Description>
              {resolvedDescription}
            </GenericStyled.Description>
          ) : null}
          {resolvedMeta ? (
            <GenericStyled.Meta>{resolvedMeta}</GenericStyled.Meta>
          ) : null}
        </GenericStyled.TextCol>
      </GenericStyled.Inner>
    </GenericStyled.Result>
  );
}
