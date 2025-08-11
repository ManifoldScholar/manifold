import PropTypes from "prop-types";
import * as Styled from "./styles";

function ResourceMediaInteractive({ resource, fixedAspectRatio }) {
  const {
    externalUrl,
    titlePlaintext,
    minimumHeight,
    minimumWidth,
    iframeAllows
  } = resource.attributes;

  const finalMinHeight = /^\d+$/.test(minimumHeight)
    ? `${minimumHeight}px`
    : minimumHeight;

  const finalMinWidth = /^\d+$/.test(minimumWidth)
    ? `${minimumWidth}px`
    : minimumWidth;

  return (
    <Styled.Interactive
      src={externalUrl}
      title={titlePlaintext}
      allow={iframeAllows?.join(" ")}
      $fixedAspectRatio={fixedAspectRatio}
      $minWidth={finalMinWidth}
      $minHeight={finalMinHeight}
      loading="lazy"
    />
  );
}

ResourceMediaInteractive.displayName = "Resource.Media.Interactive";

ResourceMediaInteractive.propTypes = {
  resource: PropTypes.object.isRequired,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaInteractive;
