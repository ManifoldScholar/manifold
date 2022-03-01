import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function MakerAvatar({ maker }) {
  const { t } = useTranslation();

  const attr = maker.attributes;

  return (
    <figure className="maker-avatar" key={maker.id}>
      {attr.avatarStyles.smallSquare ? (
        <img
          src={attr.avatarStyles.smallSquare}
          alt={t("img_alts.user_avatar")}
        />
      ) : (
        <IconComposer icon="avatar64" size="42" />
      )}
      <figcaption>{attr.fullName}</figcaption>
    </figure>
  );
}

MakerAvatar.displayName = "Maker.Avatar";

MakerAvatar.propTypes = {
  maker: PropTypes.object
};
