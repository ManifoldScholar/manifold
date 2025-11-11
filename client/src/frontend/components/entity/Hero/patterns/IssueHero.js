import { useRef } from "react";
import PropTypes from "prop-types";
import { CalloutList, Cover, Credits, Meta, Title } from "../parts";
import EntityMasthead from "frontend/components/entity/Masthead";
import { getAuth, getPartsData } from "../helpers";
import EntityHero from "../EntityHero";
import Authorization from "helpers/authorization";
import { useEventTracker } from "hooks";

export default function IssueHero({ entity, mock }) {
  const authorization = useRef(new Authorization());

  const trackEvent = useEventTracker();

  const trackIssueEvent = eventType =>
    trackEvent(eventType, entity.type, entity.id);

  if (!entity) return null;

  const { showErrors, authorized } = getAuth(entity, authorization);
  const {
    callouts,
    orderedCallouts,
    copy,
    description,
    creators,
    flattenedCollaborators,
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
            {(flattenedCollaborators || description) && (
              <Meta
                creators={creators}
                flattenedCollaborators={flattenedCollaborators}
                description={description}
              />
            )}
            {callouts && (
              <CalloutList
                track={trackIssueEvent}
                authorized={authorized || mock}
                callouts={orderedCallouts}
                showErrors={showErrors || mock}
                mobileVisible
                buttonSize="sm"
              />
            )}
          </>
        }
        TopRightComponent={
          <>
            {cover && <Cover entity={entity} />}
            {callouts && (
              <CalloutList
                track={trackIssueEvent}
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
