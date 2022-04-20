import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import TagList from "../TagList";
import * as Styled from "./styles";

function Info({ resource, detailUrl, itemHeadingLevel = 4 }) {
  const attr = resource.attributes;
  const titleTag = `h${itemHeadingLevel}`;

  return (
    <Styled.InfoLink href={detailUrl}>
      <div>
        <header>
          <Styled.Title
            as={titleTag}
            dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
          />
        </header>
        <Styled.Date>
          Uploaded <FormattedDate format="MMMM, yyyy" date={attr.createdAt} />
        </Styled.Date>
        <Styled.ArrowWrapper>
          <Styled.ArrowIcon icon="arrowRight16" size={20} />
        </Styled.ArrowWrapper>
      </div>
      <TagList resource={resource} isCard disabledLinks />
    </Styled.InfoLink>
  );
}

Info.displayName = "ResourceCard.Info";

Info.propTypes = {
  resource: PropTypes.object.isRequired,
  detailUrl: PropTypes.string,
  itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
};

export default Info;
