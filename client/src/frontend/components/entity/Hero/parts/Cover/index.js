import React from "react";
import PropTypes from "prop-types";
import EntityAvatar from "global/components/atomic/EntityAvatar";
import * as Styled from "./styles";

export default function HeroCover({ entity }) {
  const cover = entity.attributes.coverStyles?.medium ?? false;
  const alt = entity.attributes.coverAltText;

  return (
    <Styled.Cover>
      {cover ? (
        <img src={cover} alt={alt ?? ""} loading="lazy" />
      ) : (
        <EntityAvatar entity={entity} />
      )}
    </Styled.Cover>
  );
}

HeroCover.displayName = "Frontend.Entity.Hero.Parts.Cover";

HeroCover.propTypes = {
  entity: PropTypes.object.isRequired
};
