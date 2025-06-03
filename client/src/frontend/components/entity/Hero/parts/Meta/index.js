import React from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import Avatar from "./Avatar";
import * as Styled from "./styles";

export default function HeroMeta({ flattenedCollaborators, description }) {
  const showAvatars =
    flattenedCollaborators?.length < 3 &&
    flattenedCollaborators.every(c => c.attributes?.avatarStyles?.smallSquare);

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
      {!!flattenedCollaborators?.length && (
        <Styled.Contributors>
          {flattenedCollaborators.map(collaborator =>
            showAvatars ? (
              <Avatar
                key={collaborator.id}
                url={collaborator.attributes?.avatarStyles?.smallSquare}
                collaborator={renderCollaboratorWithRoles(collaborator)}
              />
            ) : (
              renderCollaboratorWithRoles(collaborator)
            )
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
  contributors: PropTypes.array,
  description: PropTypes.string
};
