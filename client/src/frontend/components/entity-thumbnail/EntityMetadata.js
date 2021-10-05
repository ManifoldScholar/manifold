import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormattedDate from "global/components/FormattedDate";

const DraftMarker = () => (
  <div className="block-label" aria-hidden>
    {"Draft"}
  </div>
);

const Markers = ({ names }) => (
  <div className="relations-list" aria-hidden>
    <span>{names}</span>
  </div>
);

const Description = ({ subtitle }) => (
  <p className="description" aria-hidden>
    {subtitle}
  </p>
);

const Date = ({ date, showUpdated, recentlyUpdated }) => {
  const className = showUpdated
    ? classNames({
        date: true,
        alert: recentlyUpdated
      })
    : "date";
  const prefix = showUpdated ? "Updated" : "Published";
  return (
    <div className={className} aria-hidden>
      <FormattedDate prefix={prefix} format="MMMM, yyyy" date={date} />
    </div>
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
    <div className="meta">
      <h3 className="name">
        <span
          className="title-text"
          dangerouslySetInnerHTML={{
            __html: data.titleFormatted
          }}
        />
        {data.draft && <DraftMarker />}
      </h3>
      {names && <Markers names={names} />}
      {!hideDate && date && !data.draft && (
        <Date
          date={date}
          showUpdated={showUpdated}
          recentlyUpdated={data.recentlyUpdated}
        />
      )}
      {!hideDescription && data.subtitle && (
        <Description subtitle={data.subtitle} />
      )}
    </div>
  );
}

EntityMetadata.propTypes = {
  entity: PropTypes.object,
  hideDescription: PropTypes.bool,
  hideDate: PropTypes.bool
};
