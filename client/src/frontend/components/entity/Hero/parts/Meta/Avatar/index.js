import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function MakerAvatar({ url, collaborator }) {
  const { t } = useTranslation();
  return (
    <Styled.Avatar>
      {url ? (
        <Styled.Image src={url} alt={t("img_alts.user_avatar")} />
      ) : (
        <Styled.Icon icon="avatar64" size="42" />
      )}
      <Styled.Caption>{collaborator}</Styled.Caption>
    </Styled.Avatar>
  );
}

MakerAvatar.displayName = "Frontend.Entity.Hero.Parts.Meta.Avatar";

MakerAvatar.propTypes = {
  collaborator: PropTypes.object.isRequired,
  url: PropTypes.string
};
