import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import { useFromStore } from "hooks";

function EntityHeadContent({ entity, type, parentEntity }) {
  const settings = useFromStore("settings", "select");
  const { t } = useTranslation(["frontend"]);

  const installationName = settings?.attributes.general.installationName || "";
  const {
    socialTitle,
    socialDescription,
    socialImageStyles,
    titlePlaintext,
    descriptionPlaintext,
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

  const title = () => {
    if (socialTitle) return socialTitle;
    const titleOrNum = (() => {
      if (parentTitle) {
        if (number) return `${parentTitle}: ${type} ${number}`;
        return `${parentTitle}: ${titlePlaintext}`;
      }
      return titlePlaintext;
    })();
    return `\u201c${titleOrNum}\u201d ${t("common.on")} ${installationName}`;
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
  type: PropTypes.string,
  parentEntity: PropTypes.object
};

export default EntityHeadContent;
