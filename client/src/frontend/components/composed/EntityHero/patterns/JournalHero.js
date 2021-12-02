import React, { useRef } from "react";
import PropTypes from "prop-types";
import { CalloutList, Meta, Social, Title, Masthead } from "../parts";
import EntityHero from "../EntityHero";
import { getAuth, getPartsData, getMastheadData } from "../helpers";
import Authorization from "helpers/authorization";

export default function JournalHero({ entity, mock }) {
  const authorization = useRef(new Authorization());
  const { showErrors, authorized } = getAuth(entity, authorization);
  const {
    callouts,
    orderedCallouts,
    bgImage,
    twitter,
    instagram,
    facebook,
    hashtag,
    social,
    description,
    creators,
    contributors
  } = getPartsData(entity);
  const { logo, mastheadColor } = getMastheadData(entity);

  return (
    <>
      {(bgImage || logo) && (
        <Masthead image={bgImage} logo={logo} color={mastheadColor} />
      )}
      <EntityHero
        theme={"journal"}
        TitleComponent={({ isStandalone }) => (
          <Title entity={entity} isStandalone={isStandalone} />
        )}
        TopLeftComponent={
          <>
            {(creators || contributors || description) && (
              <Meta
                creators={creators}
                contributors={contributors}
                description={description}
              />
            )}
            {callouts && (
              <CalloutList
                authorized={authorized || mock}
                callouts={orderedCallouts}
                showErrors={showErrors || mock}
                mobileVisible
                buttonSize="sm"
              />
            )}
          </>
        }
        BottomLeftComponent={
          social && (
            <Social
              twitter={twitter}
              facebook={facebook}
              instagram={instagram}
              hashtag={hashtag}
            />
          )
        }
        TopRightComponent={
          <>
            {callouts && (
              <CalloutList
                authorized={authorized || mock}
                callouts={callouts}
                showErrors={showErrors || mock}
                buttonSize="sm"
              />
            )}
          </>
        }
      />
    </>
  );
}

JournalHero.displayName = "Frontend.Composed.EntityHero.Journal";

JournalHero.propTypes = {
  entity: PropTypes.object.isRequired
};
