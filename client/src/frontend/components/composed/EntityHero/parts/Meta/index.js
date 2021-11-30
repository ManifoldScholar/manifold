import React from "react";
import PropTypes from "prop-types";
import MakerAvatar from "./Avatar";
import * as Styled from "./styles";

export default function HeroMeta({ entity }) {
  const description = entity.attributes.descriptionFormatted;

  const creators =
    entity.relationships.creators?.length === 0
      ? null
      : entity.relationships.creators;
  const showAvatars =
    creators?.length <= 2 &&
    creators.every(creator => creator.attributes.avatarStyles.smallSquare);

  const contributors =
    entity.relationships.contributors?.length === 0
      ? null
      : entity.relationships.contributors;

  return (
    <Styled.Wrapper>
      {creators && (
        <Styled.Creators>
          {!showAvatars && <span className="italic">by </span>}
          {creators.map(creator =>
            showAvatars ? (
              <MakerAvatar key={creator.id} maker={creator} />
            ) : (
              <Styled.Name key={creator.id}>
                {creator.attributes.fullName}
              </Styled.Name>
            )
          )}
        </Styled.Creators>
      )}
      {contributors && (
        <Styled.Contributors>
          <span className="italic">Contributors: </span>
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

HeroMeta.propTypes = {
  entity: PropTypes.object.isRequired
};
