import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import * as Styled from "./styles";

export default function Splash(props) {
  const { preview, feature, authenticated, previewAttrs } = props;
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

  const renderedHeader = () => {
    if (preview && previewAttrs?.header) return previewAttrs.header;
    return headerFormatted || header;
  };

  const renderedSubheader = () => {
    if (preview && previewAttrs?.subheader) return previewAttrs.subheader;
    return subheaderFormatted || subheader;
  };

  const renderedBody = () => {
    if (preview && previewAttrs?.body) return previewAttrs.body;
    return bodyFormatted || body;
  };

  const showSignUp = () => {
    if (preview) return previewAttrs?.includeSignUp;
    return !!includeSignUp && !authenticated;
  };

  const getLinkAttrs = () => {
    if (preview) {
      const text = previewAttrs?.linkText ?? linkText;
      const url = previewAttrs?.linkUrl ?? linkUrl;
      return {
        linkText: text,
        linkUrl: url,
        visible: !!text && !!url
      };
    }

    return {
      linkText,
      linkUrl,
      visible: !!linkText && !!linkUrl
    };
  };

  return (
    <Styled.Wrapper
      $preview={preview}
      $lightMode={mode === "light"}
      $bgColor={previewAttrs?.backgroundColor ?? backgroundColor}
      $bgImage={backgroundStyles?.original}
    >
      <Styled.Container>
        <Styled.Left>
          <Styled.Heading
            $color={previewAttrs?.headerColor ?? headerColor}
            dangerouslySetInnerHTML={{
              __html: renderedHeader()
            }}
          />
          {renderedSubheader() && (
            <Styled.Subheading
              $color={headerColor}
              dangerouslySetInnerHTML={{
                __html: renderedSubheader()
              }}
            />
          )}
          <Styled.Body
            $color={previewAttrs?.foregroundColor ?? foregroundColor}
            dangerouslySetInnerHTML={{ __html: renderedBody() }}
          />
          <Styled.Buttons>
            {getLinkAttrs().visible ? (
              <a
                href={getLinkAttrs().linkUrl}
                target="blank"
                className="utility-button"
              >
                <Styled.Button
                  className={classNames({
                    "utility-button__text--dark-green": mode === "light"
                  })}
                >
                  {getLinkAttrs().linkText}
                </Styled.Button>
              </a>
            ) : null}
            {showSignUp() ? (
              <Link
                className="utility-button"
                role="button"
                tabIndex="0"
                to={lh.link("frontendSignUp")}
              >
                <Styled.Button
                  className={classNames({
                    "utility-button__text--dark-green": mode === "light"
                  })}
                >
                  Sign Up
                </Styled.Button>
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
