import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./EntityMetadata.styles";

const DraftMarker = () => <Styled.Tag aria-hidden>{"Draft"}</Styled.Tag>;

const Creators = ({ names }) => (
  <Styled.Creators aria-hidden>
    <span>{names}</span>
  </Styled.Creators>
);

const Subtitle = ({ subtitle }) => (
  <Styled.Subtitle aria-hidden>{subtitle}</Styled.Subtitle>
);

const Description = ({ description }) => (
  <Styled.Description aria-hidden>{description}</Styled.Description>
);

const Date = ({ date, showUpdated, recentlyUpdated }) => {
  const prefix = showUpdated ? "Updated" : "Published";
  return (
    <Styled.Date recentlyUpdated={recentlyUpdated} aria-hidden>
      <FormattedDate prefix={prefix} format="MMMM, yyyy" date={date} />
    </Styled.Date>
  );
};

export default function EntityMetadata({ entity, hideDescription, hideDate }) {
  const data = entity.attributes;

  const showUpdated = !data.finished && !!data.updated;
  const date = showUpdated ? data.updatedAt : data.publicationDate;

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
        {data.draft && <DraftMarker />}
      </Styled.TitleWrapper>
      {data.subtitle && <Subtitle subtitle={data.subtitle} />}
      {names && <Creators names={names} />}
      {!hideDate && date && !data.draft && (
        <Date
          date={date}
          showUpdated={showUpdated}
          recentlyUpdated={data.recentlyUpdated}
        />
      )}
      {!hideDescription && data.description && (
        <Description description={data.description} />
      )}
    </Styled.MetadataWrapper>
  );
}

EntityMetadata.propTypes = {
  entity: PropTypes.object,
  hideDescription: PropTypes.bool,
  hideDate: PropTypes.bool
};
