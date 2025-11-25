import { forwardRef } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
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
      iconSize = "inferred",
      ...props
    },
    ref
  ) => {
    /* eslint-disable-next-line no-nested-ternary */
    const iconDisplaySize = size === "lg" ? 32 : size === "md" ? 24 : 20;

    return (
      <Styled.Button
        ref={ref}
        $size={size}
        $shape={shape}
        $background={background}
        $lowercase={lowercase}
        {...props}
      >
        {preIcon && (
          <IconComposer
            icon={preIcon}
            size={iconSize === "intrinsic" ? "default" : iconDisplaySize}
            svgProps={
              iconSize === "intrinsic"
                ? { style: { blockSize: iconDisplaySize } }
                : undefined
            }
          />
        )}
        {label && (
          <span
            aria-hidden={srLabel ? true : undefined}
            style={{
              "--_min-block-size": `${iconDisplaySize}px`
            }}
          >
            {label}
          </span>
        )}
        {srLabel && <span className="screen-reader-text">{srLabel}</span>}
        {postIcon && (
          <IconComposer
            icon={postIcon}
            size={iconSize === "intrinsic" ? "default" : iconDisplaySize}
            svgProps={
              iconSize === "intrinsic"
                ? { style: { blockSize: iconDisplaySize } }
                : undefined
            }
          />
        )}
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
    "outline-accent",
    "outline-red"
  ]),
  lowercase: PropTypes.bool
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  srLabel: PropTypes.string,
  preIcon: PropTypes.string,
  postIcon: PropTypes.string,
  // use the icon's default size or infer it from the Button's `size` prop
  iconSize: PropTypes.oneOf(["intrinsic", "inferred"]),
  ...stylePropTypes
};

Button.displayName = "Global.Atomic.Button";

export default Button;
