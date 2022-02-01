import React from "react";
import PropTypes from "prop-types";
import HeadContent from "global/components/HeadContent";
import { useSelectSettings } from "hooks";

function EntityHeadContent({ entity, parentEntity = { attributes: {} } }) {
  const settings = useSelectSettings();

  const installationName = settings?.attributes.general.installationName || "";
  const {
    socialTitle,
    socialDescription,
    socialImageStyles,
    titlePlaintext,
    descriptionPlaintext,
    heroStyles
  } = entity.attributes;
  const {
    socialDescription: parentSocialDescription,
    socialImageStyles: parentSocialImageStyles,
    titlePlaintext: parentTitle,
    descriptionPlaintext: parentDescription,
    heroStyles: parentHeroStyles
  } = parentEntity?.attributes;

  const title = () => {
    if (socialTitle) return socialTitle;
    const title = parentTitle
      ? `${parentTitle}: ${titlePlaintext}`
      : titlePlaintext;
    return `\u201c${title}\u201d on ${installationName}`;
  };

  const description = () => {
    if (socialDescription) return socialDescription;
    if (descriptionPlaintext) return descriptionPlaintext;
    if (parentSocialDescription) return parentSocialDescription;
    if (parentDescription) return parentDescription;
    return null;
  };

  const image = () => {
    if (socialImageStyles?.mediumLandscape)
      return socialImageStyles.mediumLandscape;
    if (heroStyles?.mediumLandscape) return heroStyles.mediumLandscape;
    if (parentSocialImageStyles?.mediumLandscape)
      return parentSocialImageStyles.mediumLandscape;
    if (parentHeroStyles?.mediumLandscape)
      return parentHeroStyles.mediumLandscape;
    return null;
  };

  return (
    <HeadContent title={title()} description={description()} image={image()} />
  );
}

EntityHeadContent.propTypes = {
  entity: PropTypes.object.isRequired,
  parentEntity: PropTypes.object
};

export default EntityHeadContent;
