import * as React from "react";
import PropTypes from "prop-types";
import EntityBox from "global/components/atomic/EntityBox";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import * as Styled from "./styles";

export default function EntityGroup({ entities, title, link = false }) {
  return (
    <Styled.Wrapper>
      <EntityBox>
        <Styled.GroupHeader $link={link}>
          <Styled.HeaderText>{title}</Styled.HeaderText>
          {link && <Styled.Icon icon="ArrowLongRight16" size={24} />}
        </Styled.GroupHeader>
        <ThumbnailGrid minColumns={4} minItemWidth="180px">
          {({ stack }) =>
            entities.map(entity => (
              <EntityThumbnail
                entity={entity}
                stack={stack}
                key={entity.attributes.slug}
              />
            ))
          }
        </ThumbnailGrid>
      </EntityBox>
    </Styled.Wrapper>
  );
}

EntityGroup.displayName = "Atomics.EntityGroup";

EntityGroup.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired
};
