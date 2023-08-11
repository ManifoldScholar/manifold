import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
  CalloutList,
  Cover,
  Credits,
  Image,
  Meta,
  Social,
  Title
} from "../parts";
import EntityHero from "../EntityHero";
import { getAuth, getPartsData } from "../helpers";
import Authorization from "helpers/authorization";

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
    twitter,
    instagram,
    facebook,
    hashtag,
    social,
    description,
    creators,
    contributors
  } = getPartsData(entity);

  const darkMode = !!(bgImage || entity.attributes.darkMode);

  return (
    <EntityHero
      darkMode={darkMode}
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
          {leftCallouts && (
            <CalloutList
              authorized={authorized || mock}
              callouts={leftCallouts}
              showErrors={showErrors || mock}
              darkMode={darkMode}
              inline
            />
          )}
          {callouts && (
            <CalloutList
              authorized={authorized || mock}
              callouts={orderedCallouts}
              showErrors={showErrors || mock}
              darkMode={darkMode}
              mobileVisible
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
          <Cover entity={entity} />
          {rightCallouts && (
            <CalloutList
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
