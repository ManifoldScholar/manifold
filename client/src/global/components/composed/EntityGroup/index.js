import * as React from "react";
import PropTypes from "prop-types";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import { Link } from "react-router-dom";
import * as Styled from "./styles";

export default function EntityGroup({ entities, title, to }) {
  return (
    <Styled.Box>
      <Styled.GroupHeader as={!!to && Link} to={to} $link={!!to}>
        <Styled.HeaderText>{title}</Styled.HeaderText>
        {!!to && <Styled.Icon icon="ArrowLongRight16" size={24} />}
      </Styled.GroupHeader>
      <ThumbnailGrid minColumns={4} minItemWidth="210px">
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
    </Styled.Box>
  );
}

EntityGroup.displayName = "Global.Composed.EntityGroup";

EntityGroup.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string
};
