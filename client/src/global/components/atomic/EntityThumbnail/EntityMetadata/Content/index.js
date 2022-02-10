import React from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function EntityMetadata(props) {
  const {
    date,
    prefix,
    names,
    title,
    subtitle,
    draft,
    description,
    recentlyUpdated,
    stack
  } = props;

  return (
    <Styled.MetadataWrapper $stack={stack}>
      <Styled.TitleWrapper $stack={stack}>
        <Styled.TitleText
          $stack={stack}
          dangerouslySetInnerHTML={{
            __html: title
          }}
        />
        {draft && <Styled.Tag $stack={stack}>{"Draft"}</Styled.Tag>}
      </Styled.TitleWrapper>
      {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
      {names && (
        <Styled.Creators>
          <span>{names}</span>
        </Styled.Creators>
      )}
      {date && (
        <Styled.Date $recentlyUpdated={recentlyUpdated}>
          <FormattedDate prefix={prefix} format="MMMM, yyyy" date={date} />
        </Styled.Date>
      )}
      {description && <Styled.Description>{description}</Styled.Description>}
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
