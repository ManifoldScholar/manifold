import { useRef } from "react";
import PropTypes from "prop-types";
import { CalloutList, Meta, Title, Credits } from "../parts";
import EntityMasthead from "frontend/components/entity/Masthead";
import EntityHero from "../EntityHero";
import { getAuth, getPartsData } from "../helpers";
import Authorization from "helpers/authorization";
import { useEventTracker } from "hooks";

export default function JournalHero({ entity, mock }) {
  const authorization = useRef(new Authorization());
  const { showErrors, authorized } = getAuth(entity, authorization);
  const {
    callouts,
    orderedCallouts,
    description,
    flattenedCollaborators,
    creators,
    copy
  } = getPartsData(entity);

  const trackEvent = useEventTracker();

  const trackJournalEvent = eventType =>
    trackEvent(eventType, entity.type, entity.id);

  return (
    <>
      <EntityMasthead entity={entity} />
      <EntityHero
        theme={"journal"}
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
            {!!callouts.length && (
              <CalloutList
                track={trackJournalEvent}
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
          !!callouts.length && (
            <CalloutList
              track={trackJournalEvent}
              authorized={authorized || mock}
              callouts={callouts}
              showErrors={showErrors || mock}
              buttonSize="sm"
            />
          )
        }
        BottomRightComponent={copy && <Credits copy={copy} />}
      />
    </>
  );
}

JournalHero.displayName = "Frontend.Entity.Hero.Journal";

JournalHero.propTypes = {
  entity: PropTypes.object.isRequired
};
