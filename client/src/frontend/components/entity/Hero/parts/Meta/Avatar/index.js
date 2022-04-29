import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function MakerAvatar({ maker }) {
  const { t } = useTranslation();
  return (
    <Styled.Avatar>
      {maker.attributes.avatarStyles.smallSquare ? (
        <Styled.Image
          src={maker.attributes.avatarStyles.smallSquare}
          alt={t("img_alts.user_avatar")}
        />
      ) : (
        <Styled.Icon icon="avatar64" size="42" />
      )}
      <Styled.Caption>{maker.attributes.fullName}</Styled.Caption>
    </Styled.Avatar>
  );
}

MakerAvatar.displayName = "Frontend.Entity.Hero.Parts.Meta.Avatar";

MakerAvatar.propTypes = {
  maker: PropTypes.object.isRequired
};
