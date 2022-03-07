import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import { useFromStore } from "hooks";

function EntityHeadContent({ entity, type, parentEntity }) {
  const settings = useFromStore("settings", "select");
  const { t } = useTranslation();

  const installationName = settings?.attributes.general.installationName || "";
  const {
    socialTitle,
    socialDescription,
    socialImageStyles,
    titlePlaintext,
    title,
    descriptionPlaintext,
    description,
    heroStyles,
    number
  } = entity.attributes;
  const {
    socialDescription: parentSocialDescription,
    socialImageStyles: parentSocialImageStyles,
    titlePlaintext: parentTitle,
    descriptionPlaintext: parentDescription,
    heroStyles: parentHeroStyles
  } = parentEntity?.attributes ?? {};

  const getTitle = () => {
    if (socialTitle) return socialTitle;
    const titleOrNum = (() => {
      if (parentTitle) {
        if (number) return `${parentTitle}: ${type} ${number}`;
        return `${parentTitle}: ${titlePlaintext || title}`;
      }
      return titlePlaintext || title;
    })();
    return `\u201c${titleOrNum}\u201d ${t("common.on")} ${installationName}`;
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
    if (parentSocialImageStyles?.mediumLandscape)
      return parentSocialImageStyles.mediumLandscape;
    if (parentHeroStyles?.mediumLandscape)
      return parentHeroStyles.mediumLandscape;
    return null;
  };

  return (
    <HeadContent
      title={getTitle()}
      description={getDescription()}
      image={getImage()}
    />
  );
}

EntityHeadContent.propTypes = {
  entity: PropTypes.object.isRequired,
  type: PropTypes.string,
  parentEntity: PropTypes.object
};

export default EntityHeadContent;
