import PropTypes from "prop-types";
import useShare from "hooks/useShare";
import Button, { stylePropTypes } from "global/components/atomic/Button";

export default function Share({
  title,
  size = "lg",
  shape = "rectangle",
  background = "outline-accent",
  lowercase = false
}) {
  const { disabled, canRender, onClick, icon, label, srLabel } = useShare({
    title,
    size
  });

  return canRender ? (
    <Button
      label={label}
      srLabel={srLabel}
      preIcon={icon}
      disabled={disabled}
      onClick={onClick}
      size={size}
      shape={shape}
      background={background}
      lowercase={lowercase}
    />
  ) : null;
}

Share.displayName = "Resource.Detail.Share";

Share.propTypes = {
  title: PropTypes.string.isRequired,
  ...stylePropTypes
};
