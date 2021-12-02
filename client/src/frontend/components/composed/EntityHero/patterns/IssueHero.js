import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
  CalloutList,
  Cover,
  Credits,
  Meta,
  Social,
  Title,
  Masthead
} from "../parts";
import { getAuth, getPartsData, getMastheadData } from "../helpers";
import EntityHero from "../EntityHero";
import Authorization from "helpers/authorization";

export default function IssueHero({ entity, mock }) {
  const authorization = useRef(new Authorization());
  const { showErrors, authorized } = getAuth(entity, authorization);
  const {
    callouts,
    orderedCallouts,
    copy,
    bgImage,
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

IssueHero.displayName = "Frontend.Composed.EntityHero.Issue";

IssueHero.propTypes = {
  entity: PropTypes.object.isRequired
};
