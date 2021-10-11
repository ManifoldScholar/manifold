import React from "react";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import * as Styled from "./ThumbnailGrid.styles";
import PropTypes from "prop-types";

export default function ThumbnailGrid({
  entities,
  onUncollect,
  userMock,
  grid = true,
  minWidth = "200px"
}) {
  return (
    <Styled.GridList grid={grid} minWidth={minWidth}>
      {entities.map(entity => {
        return (
          <Styled.GridItem key={entity.id}>
            <EntityThumbnail
              entity={entity}
              onUncollect={onUncollect}
              userMock={userMock}
              stack={grid}
            />
          </Styled.GridItem>
        );
      })}
    </Styled.GridList>
  );
}

EntityThumbnail.propTypes = {
  entities: PropTypes.array,
  onUncollect: PropTypes.func,
  grid: PropTypes.bool,
  minWidth: PropTypes.string,
  /* For stories */
  userMock: PropTypes.object
};
