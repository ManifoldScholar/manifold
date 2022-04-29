import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import MakerAvatar from "./Avatar";
import * as Styled from "./styles";

export default function HeroMeta({ creators, contributors, description }) {
  const { t } = useTranslation();
  const showAvatars =
    creators?.length <= 2 &&
    creators.every(creator => creator.attributes?.avatarStyles?.smallSquare);

  return (
    <Styled.Wrapper>
      {!!creators?.length && (
        <Styled.Creators>
          {!showAvatars && <span className="italic">{t("common.by")} </span>}
          {creators.map(creator =>
            showAvatars ? (
              <MakerAvatar key={creator.id} maker={creator} />
            ) : (
              <Styled.Name key={creator.id}>
                {creator.attributes?.fullName}
              </Styled.Name>
            )
          )}
        </Styled.Creators>
      )}
      {!!contributors?.length && (
        <Styled.Contributors>
          <span className="italic">
            {t("glossary.contributor_title_case", {
              count: contributors.length
            })}
            :{" "}
          </span>
          {contributors.map(contributor => (
            <Styled.Name key={contributor.id}>
              {contributor.attributes.fullName}
            </Styled.Name>
          ))}
        </Styled.Contributors>
      )}
      {description && (
        <Styled.Description dangerouslySetInnerHTML={{ __html: description }} />
      )}
    </Styled.Wrapper>
  );
}

HeroMeta.displayName = "Frontend.Entity.Hero.Parts.Meta";

HeroMeta.propTypes = {
  creators: PropTypes.array,
  contributors: PropTypes.array,
  description: PropTypes.string
};
