import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useFrontendModeContext } from "hooks";
import * as Styled from "./styles";

export default function EntityHero({
  TitleComponent,
  TopLeftComponent,
  TopRightComponent,
  BottomLeftComponent,
  BottomRightComponent,
  ImageComponent,
  darkMode = false,
  theme = "project"
}) {
  const resizeId = useRef(null);
  const rightColRef = useRef();
  const titleRef = useRef();
  const { isStandalone } = useFrontendModeContext();

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

  /* eslint-disable no-nested-ternary */
  const WrapperComponent =
    theme === "journal"
      ? Styled.JournalWrapper
      : theme === "issue"
      ? Styled.IssueWrapper
      : Styled.Wrapper;
  /* eslint-enable no-nested-ternary */

  return (
    <WrapperComponent $darkMode={darkMode} $standalone={isStandalone}>
      <Styled.Inner>
        <Styled.TopLeft>
          <div ref={titleRef}>{TitleComponent({ isStandalone })}</div>
          {TopLeftComponent}
        </Styled.TopLeft>
        {BottomLeftComponent && (
          <Styled.BottomLeft>{BottomLeftComponent}</Styled.BottomLeft>
        )}
        {TopRightComponent && (
          <Styled.TopRight ref={rightColRef}>
            {TopRightComponent}
          </Styled.TopRight>
        )}
        {BottomRightComponent && (
          <Styled.BottomRight>{BottomRightComponent}</Styled.BottomRight>
        )}
      </Styled.Inner>
      {ImageComponent && ImageComponent}
    </WrapperComponent>
  );
}

EntityHero.displayName = "Frontend.Entity.Hero";

EntityHero.propTypes = {
  TitleComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  TopLeftComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  TopRightComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool
  ]),
  BottomLeftComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool
  ]),
  BottomRightComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool,
    PropTypes.node
  ]),
  ImageComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.bool
  ]),
  darkMode: PropTypes.bool,
  theme: PropTypes.oneOf(["project", "journal", "issue"])
};
