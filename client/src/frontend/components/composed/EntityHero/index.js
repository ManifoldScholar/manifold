import React, { useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import {
  CalloutList,
  Cover,
  Credits,
  Image,
  Meta,
  Social,
  Title
} from "./parts";
import Authorization from "helpers/authorization";
import { FrontendModeContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function EntityHero({ entity, mock }) {
  const authorization = useRef(new Authorization());
  const resizeId = useRef(null);
  const rightColRef = useRef();
  const titleRef = useRef();
  const { isStandalone } = useContext(FrontendModeContext);

  const showErrors = authorization.current.authorizeAbility({
    entity,
    ability: "update"
  });
  const authorized = authorization.current.authorizeAbility({
    entity,
    ability: "fullyRead"
  });

  const addStandaloneMargin = () => {
    if (!rightColRef.current || !titleRef.current) return;
    const height = titleRef.current.offsetHeight;
    rightColRef.current.style.marginTop = `${height}px`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (resizeId.current) {
        window.cancelAnimationFrame(resizeId);
      }
      resizeId.current = window.requestAnimationFrame(() => {
        addStandaloneMargin();
      });
    };

    if (isStandalone) {
      window.addEventListener("resize", handleResize);
      return window.removeEventListener("resize", handleResize);
    }
  }, [isStandalone]);

  const callouts = entity.relationships.actionCallouts;
  const calloutsBySide = side =>
    orderBy(
      callouts.filter(callout => callout.attributes.location === side),
      ["attributes.button", "attributes.position"],
      ["desc", "asc"]
    );
  const leftCallouts = calloutsBySide("left");
  const rightCallouts = calloutsBySide("right");
  const orderedCallouts = orderBy(
    callouts,
    ["attributes.button", "attributes.location", "attributes.position"],
    ["desc", "asc", "asc"]
  );

  const copy = entity.attributes.imageCreditsFormatted;
  const bgImage =
    entity.attributes.heroStyles.largeLandscape &&
    entity.attributes.heroStyles.mediumLandscape
      ? entity.attributes.heroStyles
      : false;

  const twitter = entity.attributes.twitterId;
  const instagram = entity.attributes.instagramId;
  const facebook = entity.attributes.facebookId;
  const hashtag = entity.attributes.hashtag;
  const social = !!twitter || !!instagram || !!facebook || !!hashtag;

  const lightMode = !bgImage && !entity.attributes.darkMode;

  return (
    <Styled.Wrapper $lightMode={lightMode} $standalone={isStandalone}>
      <Styled.Inner>
        <Styled.TopLeft>
          <div ref={titleRef}>
            <Title entity={entity} standalone={isStandalone} />
          </div>
          <Meta entity={entity} />
          {leftCallouts && (
            <CalloutList
              authorized={authorized || mock}
              callouts={leftCallouts}
              showErrors={showErrors || mock}
              lightMode={lightMode}
              inline
            />
          )}
          {callouts && (
            <CalloutList
              authorized={authorized || mock}
              callouts={orderedCallouts}
              showErrors={showErrors || mock}
              lightMode={lightMode}
              mobileVisible
            />
          )}
        </Styled.TopLeft>
        <Styled.BottomLeft>
          {social && (
            <Social
              twitter={twitter}
              facebook={facebook}
              instagram={instagram}
              hashtag={hashtag}
            />
          )}
        </Styled.BottomLeft>
        <Styled.TopRight ref={rightColRef}>
          <Cover entity={entity} />
          {rightCallouts && (
            <CalloutList
              authorized={authorized ?? mock}
              callouts={rightCallouts}
              showErrors={showErrors ?? mock}
              lightMode={lightMode}
            />
          )}
        </Styled.TopRight>
        <Styled.BottomRight>
          {copy && <Credits copy={copy} />}
        </Styled.BottomRight>
      </Styled.Inner>
      {bgImage && <Image image={bgImage} />}
    </Styled.Wrapper>
  );
}

EntityHero.propTypes = {
  entity: PropTypes.object.isRequired
};
