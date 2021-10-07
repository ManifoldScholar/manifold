import React from "react";
import EntityThumbnail from "frontend/components/EntityThumbnail";
import * as Styled from "./ThumbnailGrid.styles";
import PropTypes from "prop-types";

export default function ThumbnailGrid({ entities, onUncollect, userMock }) {
  return (
    <Styled.GridWrapper>
      <Styled.GridList>
        {entities.map((entity, i) => {
          return (
            <Styled.GridItem key={i}>
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
