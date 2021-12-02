import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function MakerAvatar({ maker }) {
  return (
    <Styled.Avatar>
      {maker.attributes.avatarStyles.smallSquare ? (
        <Styled.Image
          src={maker.attributes.avatarStyles.smallSquare}
          alt="User Avatar"
        />
      ) : (
        <Styled.Icon icon="avatar64" size="42" />
      )}
      <Styled.Caption>{maker.attributes.fullName}</Styled.Caption>
    </Styled.Avatar>
  );
}

MakerAvatar.displayName = "Frontend.Composed.EntityHero.Parts.Meta.Avatar";

MakerAvatar.propTypes = {
  maker: PropTypes.object.isRequired
};
