import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./EntityMetadata.styles";

export default function EntityMetadata({ entity, hideDescription, hideDate }) {
  const data = entity.attributes;

  const showUpdated = !data.finished && !!data.updated;
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

  return (
    <Styled.MetadataWrapper>
      <Styled.TitleWrapper>
        <Styled.TitleText
          dangerouslySetInnerHTML={{
            __html: data.titleFormatted
          }}
        />
        {data.draft && <Styled.Tag aria-hidden>{"Draft"}</Styled.Tag>}
      </Styled.TitleWrapper>
      {data.subtitle && (
        <Styled.Subtitle aria-hidden>{data.subtitle}</Styled.Subtitle>
      )}
      {names && (
        <Styled.Creators aria-hidden>
          <span>{names}</span>
        </Styled.Creators>
      )}
      {!hideDate && date && !data.draft && (
        <Styled.Date recentlyUpdated={data.recentlyUpdated} aria-hidden>
          <FormattedDate prefix={prefix} format="MMMM, yyyy" date={date} />
        </Styled.Date>
      )}
      {!hideDescription && data.description && (
        <Styled.Description aria-hidden>{data.description}</Styled.Description>
      )}
    </Styled.MetadataWrapper>
  );
}

EntityMetadata.propTypes = {
  entity: PropTypes.object,
  hideDescription: PropTypes.bool,
  hideDate: PropTypes.bool
};
