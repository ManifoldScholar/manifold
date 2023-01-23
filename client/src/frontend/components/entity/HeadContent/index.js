import React from "react";
import PropTypes from "prop-types";
import { useFromStore } from "hooks";
import HeadContent from "global/components/HeadContent";

function EntityHeadContent({
  entity,
  type,
  parentEntity,
  showParentTitle = true,
  titleOverride
}) {
  const {
    socialTitle,
    socialDescription,
    socialImageStyles,
    titlePlaintext,
    title,
    descriptionPlaintext,
    description,
    heroStyles,
    attachmentStyles,
    variantThumbnailStyles,
    number
  } = entity.attributes;
  const {
    socialDescription: parentSocialDescription,
    socialImageStyles: parentSocialImageStyles,
    titlePlaintext: parentTitle,
    descriptionPlaintext: parentDescription,
    heroStyles: parentHeroStyles
  } = parentEntity?.attributes ?? {};
  const settings = useFromStore("settings", "select");
  const headTitle = settings?.attributes.general.headTitle;

  const appendHeadTitle = entityTitle => {
    if (!headTitle) return entityTitle;
    return `${entityTitle} | ${headTitle}`;
  };

  const getTitle = () => {
    if (titleOverride) return titleOverride;
    if (parentTitle && showParentTitle) {
      if (number) return `${type} ${number} | ${parentTitle}`;
      return `${titlePlaintext || title} | ${parentTitle}`;
    }
    return titlePlaintext || title;
  };

  const getSocialTitle = () => {
    return socialTitle || appendHeadTitle(getTitle());
  };

  const getDescription = () => {
    if (socialDescription) return socialDescription;
    if (descriptionPlaintext) return descriptionPlaintext;
    if (description) return description;
    if (parentSocialDescription) return parentSocialDescription;
    if (parentDescription) return parentDescription;
    return null;
  };

  const getImage = () => {
    if (socialImageStyles?.mediumLandscape)
      return socialImageStyles.mediumLandscape;
    if (heroStyles?.mediumLandscape) return heroStyles.mediumLandscape;
    if (attachmentStyles?.mediumSquare) return attachmentStyles.mediumSquare;
    if (variantThumbnailStyles?.mediumSquare)
      return variantThumbnailStyles.mediumSquare;
    if (parentSocialImageStyles?.mediumLandscape)
      return parentSocialImageStyles.mediumLandscape;
    if (parentHeroStyles?.mediumLandscape)
      return parentHeroStyles.mediumLandscape;
    return null;
  };

  return (
    <HeadContent
      title={getTitle()}
      socialTitle={getSocialTitle()}
      description={getDescription()}
      image={getImage()}
      appendDefaultTitle
    />
  );
}

EntityHeadContent.displayName = "Frontend.Entity.HeadContent";

EntityHeadContent.propTypes = {
  entity: PropTypes.object.isRequired,
  type: PropTypes.string,
  parentEntity: PropTypes.object,
  showParentTitle: PropTypes.bool,
  titleOverride: PropTypes.string
};

export default EntityHeadContent;
