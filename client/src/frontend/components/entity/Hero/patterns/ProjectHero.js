import { useRef } from "react";
import PropTypes from "prop-types";
import { CalloutList, Cover, Credits, Image, Meta, Title } from "../parts";
import EntityHero from "../EntityHero";
import { getAuth, getPartsData } from "../helpers";
import Authorization from "helpers/authorization";
import { useEventTracker } from "hooks";

export default function ProjectHero({ entity, mock }) {
  const authorization = useRef(new Authorization());
  const { showErrors, authorized } = getAuth(entity, authorization);
  const {
    callouts,
    orderedCallouts,
    leftCallouts,
    rightCallouts,
    copy,
    bgImage,
    bgAlt,
    description,
    flattenedCollaborators
  } = getPartsData(entity);

  const darkMode = !!(bgImage || entity.attributes.darkMode);

  const trackEvent = useEventTracker();

  const trackProjectEvent = eventType =>
    trackEvent(eventType, entity.type, entity.id);

  return (
    <EntityHero
      darkMode={darkMode}
      TitleComponent={({ isStandalone }) => (
        <Title entity={entity} isStandalone={isStandalone} />
      )}
      TopLeftComponent={
        <>
          {(flattenedCollaborators || description) && (
            <Meta
              flattenedCollaborators={flattenedCollaborators}
              description={description}
            />
          )}
          {leftCallouts && (
            <CalloutList
              track={trackProjectEvent}
              authorized={authorized || mock}
              callouts={leftCallouts}
              showErrors={showErrors || mock}
              darkMode={darkMode}
              inline
            />
          )}
          {callouts && (
            <CalloutList
              track={trackProjectEvent}
              authorized={authorized || mock}
              callouts={orderedCallouts}
              showErrors={showErrors || mock}
              darkMode={darkMode}
              mobileVisible
            />
          )}
        </>
      }
      TopRightComponent={
        <>
          <Cover entity={entity} />
          {rightCallouts && (
            <CalloutList
              track={trackProjectEvent}
              authorized={authorized || mock}
              callouts={rightCallouts}
              showErrors={showErrors ?? mock}
              darkMode={darkMode}
            />
          )}
        </>
      }
      BottomRightComponent={copy && <Credits copy={copy} />}
      ImageComponent={bgImage && <Image image={bgImage} alt={bgAlt} />}
    />
  );
}

ProjectHero.displayName = "Frontend.Entity.Hero.Project";

ProjectHero.propTypes = {
  entity: PropTypes.object.isRequired
};
