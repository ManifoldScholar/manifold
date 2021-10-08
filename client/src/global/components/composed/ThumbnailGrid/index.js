import React from "react";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import * as Styled from "./ThumbnailGrid.styles";
import PropTypes from "prop-types";

export default function ThumbnailGrid({ entities, onUncollect, userMock }) {
  return (
    <Styled.GridWrapper>
      <Styled.GridList>
        {entities.map(entity => {
          return (
            <Styled.GridItem key={entity.id}>
              <EntityThumbnail
                entity={entity}
                onUncollect={onUncollect}
                userMock={userMock}
              />
            </Styled.GridItem>
          );
        })}
      </Styled.GridList>
    </Styled.GridWrapper>
  );
}

EntityThumbnail.propTypes = {
  entities: PropTypes.array,
  onUncollect: PropTypes.func,
  /* For stories */
  userMock: PropTypes.object
};
