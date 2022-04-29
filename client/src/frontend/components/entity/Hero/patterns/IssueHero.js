import React, { useRef } from "react";
import PropTypes from "prop-types";
import { CalloutList, Cover, Credits, Meta, Social, Title } from "../parts";
import EntityMasthead from "frontend/components/entity/Masthead";
import { getAuth, getPartsData } from "../helpers";
import EntityHero from "../EntityHero";
import Authorization from "helpers/authorization";

export default function IssueHero({ entity, mock }) {
  const authorization = useRef(new Authorization());
  if (!entity) return null;

  const { showErrors, authorized } = getAuth(entity, authorization);
  const {
    callouts,
    orderedCallouts,
    copy,
    twitter,
    instagram,
    facebook,
    hashtag,
    social,
    description,
    creators,
    contributors,
    cover
  } = getPartsData(entity);
  return (
    <>
      <EntityMasthead entity={entity} />
      <EntityHero
        theme="issue"
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
            {cover && <Cover entity={entity} />}
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
        BottomRightComponent={copy && <Credits copy={copy} />}
      />
    </>
  );
}

IssueHero.displayName = "Frontend.Entity.Hero.Issue";

IssueHero.propTypes = {
  entity: PropTypes.object.isRequired
};
