import React from "react";
import PropTypes from "prop-types";
import MakerAvatar from "./Avatar";
import capitalize from "lodash/capitalize";
import partition from "lodash/partition";
import * as Styled from "./styles";

export default function HeroMeta({
  creators,
  flattenedCollaborators,
  description
}) {
  const showAvatars =
    creators?.length <= 2 &&
    creators.every(creator => creator.attributes?.avatarStyles?.smallSquare);

  const [authors, others] = partition(flattenedCollaborators, fc =>
    creators.find(c => c.id === fc.relationships.maker.id)
  );

  const renderCollaboratorWithRoles = collaborator => (
    <Styled.Name key={collaborator.id}>
      {collaborator.attributes.makerName}
      <Styled.Roles>
        {collaborator.attributes.roles
          .map(r => capitalize(r).replaceAll("_", " "))
          .join(", ")}
      </Styled.Roles>
    </Styled.Name>
  );

  return (
    <Styled.Wrapper>
      {!!authors?.length && (
        <Styled.Creators>
          {authors.map(author =>
            showAvatars ? (
              <MakerAvatar
                key={authors.id}
                maker={creators.find(
                  c => c.id === author.relationships.maker.id
                )}
              />
            ) : (
              renderCollaboratorWithRoles(author)
            )
          )}
        </Styled.Creators>
      )}
      {!!others?.length && (
        <Styled.Contributors>
          {others.map(collaborator =>
            renderCollaboratorWithRoles(collaborator)
          )}
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
