import PropTypes from "prop-types";
import * as Styled from "./styles";

const LogoAvatar = ({ entity }) => {
  const meta = entity.attributes.logoMeta?.original;
  const logoKey = meta.width >= meta.height ? "smallSquare" : "small";
  const src = entity.attributes.logoStyles[logoKey];
  const { width, height } = entity.attributes.logoMeta[logoKey] ?? {};
  const alt = entity.attributes.logoAltText;

  return (
    <Styled.Avatar
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};

LogoAvatar.displayName = "Global.Atomic.EntityAvatar.Logo";

LogoAvatar.propTypes = {
  entity: PropTypes.object,
  stack: PropTypes.bool
};

export default LogoAvatar;
