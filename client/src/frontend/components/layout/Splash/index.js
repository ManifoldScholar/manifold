import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import * as Styled from "./styles";

export default function Splash(props) {
  const { preview, feature, authenticated } = props;
  const {
    style: mode,
    backgroundColor,
    backgroundStyles,
    header,
    headerFormatted,
    subheader,
    subheaderFormatted,
    headerColor,
    foregroundColor,
    foregroundStyles,
    foregroundTop,
    foregroundLeft,
    foregroundPosition,
    body,
    bodyFormatted,
    linkText,
    linkUrl,
    includeSignUp
  } = feature.attributes;

  return (
    <Styled.Wrapper
      $preview={preview}
      $lightMode={mode === "light"}
      $bgColor={backgroundColor}
      $bgImage={backgroundStyles?.original}
    >
      <Styled.Container>
        <Styled.Left>
          <Styled.Heading
            $color={headerColor}
            dangerouslySetInnerHTML={{
              __html: headerFormatted || header
            }}
          />
          {(subheaderFormatted || subheader) && (
            <Styled.Subheading
              $color={headerColor}
              dangerouslySetInnerHTML={{
                __html: subheaderFormatted || subheader
              }}
            />
          )}
          <Styled.Body
            $color={foregroundColor}
            dangerouslySetInnerHTML={{ __html: bodyFormatted || body }}
          />
          <Styled.Buttons>
            {linkText && linkUrl ? (
              <a href={linkUrl} target="blank" className="utility-button">
                <span
                  className={classNames(
                    "utility-button__text",
                    "utility-button__text--large",
                    {
                      "utility-button__text--dark-green": mode === "light"
                    }
                  )}
                >
                  {linkText}
                </span>
              </a>
            ) : null}
            {includeSignUp && !authenticated ? (
              <Link
                className="utility-button"
                role="button"
                tabIndex="0"
                to={lh.link("frontendSignUp")}
              >
                <span
                  className={classNames(
                    "utility-button__text",
                    "utility-button__text--large",
                    {
                      "utility-button__text--dark-green": mode === "light"
                    }
                  )}
                >
                  Sign Up
                </span>
              </Link>
            ) : null}
          </Styled.Buttons>
        </Styled.Left>
        <Styled.Right>
          {foregroundStyles?.original ? (
            <Styled.Image
              $top={foregroundTop}
              $left={foregroundLeft}
              $position={foregroundPosition}
              src={foregroundStyles.original}
              alt={header}
            />
          ) : null}
        </Styled.Right>
      </Styled.Container>
    </Styled.Wrapper>
  );
}

Splash.displayName = "Frontend.Components.Layout.Splash";

Splash.propTypes = {
  authenticated: PropTypes.bool,
  feature: PropTypes.object,
  preview: PropTypes.bool
};
