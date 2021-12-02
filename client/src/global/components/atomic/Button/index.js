import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function Button({
  children,
  size = "sm",
  secondary,
  dark,
  icon,
  iconSize,
  width,
  ...props
}) {
  return (
    <Styled.Button
      $secondary={secondary}
      $size={size}
      $darkMode={dark}
      $width={width}
      {...props}
    >
      {icon && <Styled.ButtonIcon icon={icon} size={iconSize} />}
      {children && <Styled.ButtonText>{children}</Styled.ButtonText>}
    </Styled.Button>
  );
}

Button.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"]),
  secondary: PropTypes.bool,
  dark: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number
};

Button.displayName = "Global.Atomic.Button";
