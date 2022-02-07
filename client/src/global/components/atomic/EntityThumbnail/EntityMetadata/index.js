import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function EntityMetadata({
  entity,
  parentView,
  hideDescription,
  hideDate,
  stack
}) {
  const data = entity?.attributes;

  if (!data) return null;

  const showUpdated =
    (!data.finished && !!data.updated) || !data.publicationDate;
  const date = showUpdated ? data.updatedAt : data.publicationDate;
  const prefix = showUpdated ? "Updated" : "Published";

  /* eslint-disable no-nested-ternary */
  const names =
    "creatorNames" in data
      ? data.creatorNames
      : entity.relationships?.creators?.length > 0
      ? entity.relationships.creators
          .map(maker => maker.attributes.fullName)
          .join(", ")
      : null;
  /* eslint-enable no-nested-ternary */

  const title = parentView
    ? `Issue ${data.number}`
    : data.titleFormatted ?? data.title ?? `Issue ${data.number}`;

  return (
    <Styled.MetadataWrapper $stack={stack}>
      <Styled.TitleWrapper $stack={stack}>
        <Styled.TitleText
          $stack={stack}
          dangerouslySetInnerHTML={{
            __html: title
          }}
        />
        {data.draft && <Styled.Tag $stack={stack}>{"Draft"}</Styled.Tag>}
      </Styled.TitleWrapper>
      {data.subtitle && <Styled.Subtitle>{data.subtitle}</Styled.Subtitle>}
      {names && (
        <Styled.Creators>
          <span>{names}</span>
        </Styled.Creators>
      )}
      {!hideDate && date && !data.draft && (
        <Styled.Date $recentlyUpdated={data.recentlyUpdated}>
          <FormattedDate prefix={prefix} format="MMMM, yyyy" date={date} />
        </Styled.Date>
      )}
      {!hideDescription && data.description && (
        <Styled.Description>{data.description}</Styled.Description>
      )}
    </Styled.MetadataWrapper>
  );
}

EntityMetadata.displayName = "Global.Atomic.EntityThumbnail.Metadata";

EntityMetadata.propTypes = {
  entity: PropTypes.object,
  hideDescription: PropTypes.bool,
  hideDate: PropTypes.bool,
  stack: PropTypes.bool
};
