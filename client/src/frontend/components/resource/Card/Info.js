import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import IconComposer from "global/components/utility/IconComposer";
import TagList from "../TagList";

function Info({ resource, detailUrl, itemHeadingLevel = 4 }) {
  const attr = resource.attributes;
  const TitleTag = `h${itemHeadingLevel}`;

  return (
    <a href={detailUrl} className="resource-card__info">
      <div>
        <header>
          <TitleTag
            dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
            className="resource-card__title"
          />
        </header>
        <span className="resource-card__date">
          Uploaded <FormattedDate format="MMMM, yyyy" date={attr.createdAt} />
        </span>
        <div className="resource-card__arrow-link">
          <IconComposer
            icon="arrowRight16"
            size={20}
            iconClass="resource-card__arrow-link-icon"
          />
        </div>
      </div>
      <TagList resource={resource} />
    </a>
  );
}

Info.displayName = "ResourceCard.Info";

Info.propTypes = {
  resource: PropTypes.object.isRequired,
  detailUrl: PropTypes.string,
  itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
};

export default Info;
