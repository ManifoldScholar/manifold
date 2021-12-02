import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
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
      {icon && <IconComposer icon={icon} size={iconSize} />}
      {children && <Styled.ButtonText>{children}</Styled.ButtonText>}
    </Styled.Button>
  );
}

Button.propTypes = {
  children: PropTypes.string,
  size: PropTypes.string,
  secondary: PropTypes.bool,
  dark: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number
};
