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
    includeSRCloseButton = true,
    headerId,
    handleLeaveEvent
  } = props;

  const hasTitle = title || icon;
  const hasClose = closeCallback || closeUrl;

  const { t } = useTranslation();

  const Bar = context === "reader" ? Styled.BarReader : Styled.Bar;

  return (
    <>
      {includeDrawerFrontMatter && (
        <Bar $padLateral={padding === "none"}>
          {hasTitle ? (
            <Styled.Title>
              {icon && <Styled.TitleIcon icon={icon} size={24} />}
              {title && (
                <span id={headerId}>
                  {typeof title === "object" ? t(title.key) : title}
                </span>
              )}
            </Styled.Title>
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
      )}
      {!hasClose && includeSRCloseButton && (
        <button
          onClick={handleLeaveEvent}
          tabIndex="0"
          className="screen-reader-text"
        >
          {t("actions.close")}
        </button>
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
  context: PropTypes.oneOf(["backend", "frontend", "reader"]),
  padding: PropTypes.oneOf(["none", "default", "large"]),
  includeDrawerFrontMatter: PropTypes.bool,
  includeSRCloseButton: PropTypes.bool,
  headerId: PropTypes.string.isRequired,
  handleLeaveEvent: PropTypes.func.isRequired
};
