import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComputed from "global/components/icon-computed";
import * as Styled from "./styles";

export default function HeroSocial({ hashtag, twitter, facebook, instagram }) {
  const { t } = useTranslation();

  const url = (service, id) => {
    switch (service) {
      case "twitter":
        return `https://twitter.com/${id}`;
      case "instagram":
        return `https://instagram.com/${id}`;
      case "facebook":
        return `https://facebook.com/${id}`;
      default:
        return null;
    }
  };

  const socialLink = (service, id) => (
    <Styled.Link
      key={service}
      target="_blank"
      rel="noopener noreferrer"
      href={url(service, id)}
    >
      <IconComputed.Social icon={service} size={32} />
      <span className="screen-reader-text">
        {t("external_links.view_on_social", { service })}
      </span>
    </Styled.Link>
  );

  return (
    <Styled.SocialLinks>
      {twitter && socialLink("twitter", twitter)}
      {facebook && socialLink("facebook", facebook)}
      {instagram && socialLink("instagram", instagram)}
      <div>
        {hashtag && (
          <Styled.Hashtag
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/hashtag/${hashtag}`}
          >
            {`#${hashtag}`}
          </Styled.Hashtag>
        )}
      </div>
    </Styled.SocialLinks>
  );
}

HeroSocial.displayName = "Frontend.Entity.Hero.Parts.Social";

HeroSocial.propTypes = {
  hashtag: PropTypes.string,
  twitter: PropTypes.string,
  facebook: PropTypes.string,
  instagram: PropTypes.string
};
