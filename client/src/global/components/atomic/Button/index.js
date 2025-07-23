import { forwardRef } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const Button = forwardRef(
  (
    {
      label,
      srLabel,
      size = "sm",
      shape = "rectangle",
      background = "neutral",
      lowercase = false,
      preIcon,
      postIcon,
      ...props
    },
    ref
  ) => {
    /* eslint-disable-next-line no-nested-ternary */
    const iconSize = size === "lg" ? 32 : size === "md" ? 24 : 20;

    return (
      <Styled.Button
        ref={ref}
        $size={size}
        $shape={shape}
        $background={background}
        $lowercase={lowercase}
        {...props}
      >
        {preIcon && <Styled.ButtonIcon icon={preIcon} size={iconSize} />}
        {label && (
          <span
            aria-hidden={srLabel ? true : undefined}
            style={{
              "--_min-block-size": `${iconSize}px`
            }}
          >
            {label}
          </span>
        )}
        {srLabel && <span className="screen-reader-text">{srLabel}</span>}
        {postIcon && <Styled.ButtonIcon icon={postIcon} size={iconSize} />}
      </Styled.Button>
    );
  }
);

export const stylePropTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  shape: PropTypes.oneOf(["rectangle", "lozenge"]),
  background: PropTypes.oneOf([
    "neutral",
    "accent",
    "outline",
    "outline-accent"
  ]),
  lowercase: PropTypes.bool
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  srLabel: PropTypes.string,
  preIcon: PropTypes.string,
  postIcon: PropTypes.string,
  ...stylePropTypes
};

Button.displayName = "Global.Atomic.Button";

export default Button;
