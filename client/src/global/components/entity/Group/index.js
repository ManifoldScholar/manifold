import * as React from "react";
import PropTypes from "prop-types";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import { Link } from "react-router-dom";
import * as Styled from "./styles";

export default function EntityGroup({
  entities,
  title,
  to,
  children,
  parentView,
  placeholderText
}) {
  const showPlaceholder = !entities?.length && !children;

  return (
    <Styled.Box>
      {title && (
        <Styled.GroupHeader as={!!to && Link} to={to} $link={!!to}>
          <Styled.HeaderText>{title}</Styled.HeaderText>
          {!!to && <Styled.Icon icon="ArrowLongRight16" size={24} />}
        </Styled.GroupHeader>
      )}
      <Styled.Body>
        {!!entities?.length && (
          <ThumbnailGrid
            minColumns={4}
            minItemWidth="210px"
            parentView={parentView}
          >
            {({ stack }) =>
              entities.map(entity => (
                <EntityThumbnail
                  entity={entity}
                  stack={stack}
                  key={entity.id}
                  parentView={parentView}
                />
              ))
            }
          </ThumbnailGrid>
        )}
        {showPlaceholder && (
          <Styled.PlaceholderText>{placeholderText}</Styled.PlaceholderText>
        )}
        {children}
      </Styled.Body>
    </Styled.Box>
  );
}

EntityGroup.displayName = "Global.Entity.Group";

EntityGroup.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.node,
  placeholderText: PropTypes.string.isRequired
};
