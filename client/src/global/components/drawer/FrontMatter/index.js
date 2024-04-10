import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function FrontMatter(props) {
  const {
    title,
    icon,
    closeCallback,
    closeUrl,
    context,
    padding,
    includeDrawerFrontMatter = true,
    headerId,
    handleLeaveEvent,
    fullScreenTitle,
    ariaLabel
  } = props;

  const hasTitle = title || icon;
  const hasClose = closeCallback || closeUrl;

  const { t } = useTranslation();

  const Bar = context === "reader" ? Styled.BarReader : Styled.Bar;

  return (
    <>
      {includeDrawerFrontMatter ? (
        <Bar $padLateral={padding === "none"} $padBottom={!!fullScreenTitle}>
          {hasTitle && !fullScreenTitle ? (
            <Styled.Title>
              {icon && <Styled.TitleIcon icon={icon} size={24} />}
              {title && (
                <Styled.TitleText id={headerId}>
                  {typeof title === "object" ? t(title.key) : title}
                </Styled.TitleText>
              )}
            </Styled.Title>
          ) : (
            ariaLabel && (
              <span id={headerId} className="screen-reader-text">
                {ariaLabel}
              </span>
            )
          )}
          {fullScreenTitle ? (
            <Styled.FullScreenTitle>
              {icon && <Styled.FullScreenTitleIcon icon={icon} size={32} />}
              <Styled.FullScreenTitleText id={headerId}>
                {typeof fullScreenTitle === "object"
                  ? t(fullScreenTitle.key)
                  : fullScreenTitle}
              </Styled.FullScreenTitleText>
            </Styled.FullScreenTitle>
          ) : null}
          {hasClose ? (
            <Styled.CloseButton
              onClick={handleLeaveEvent}
              tabIndex="0"
              $primary={context !== "backend"}
            >
              <Styled.CloseText>{t("actions.close")}</Styled.CloseText>
              <Styled.CloseIcon icon="close24" size={24} />
            </Styled.CloseButton>
          ) : null}
        </Bar>
      ) : (
        ariaLabel && (
          <span id={headerId} className="screen-reader-text">
            {ariaLabel}
          </span>
        )
      )}
    </>
  );
}

FrontMatter.displayName = "Drawer.FrontMatter";

FrontMatter.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  closeCallback: PropTypes.func,
  closeUrl: PropTypes.string,
  context: PropTypes.oneOf(["backend", "frontend", "reader", "editor"]),
  padding: PropTypes.oneOf(["none", "default", "large", "xl"]),
  includeDrawerFrontMatter: PropTypes.bool,
  headerId: PropTypes.string.isRequired,
  handleLeaveEvent: PropTypes.func.isRequired
};
