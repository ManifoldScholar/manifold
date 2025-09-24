import { useFromStore } from "hooks";
import { useTranslation } from "react-i18next";

const appendHeadTitle = (entityTitle, headTitle) => {
  if (!headTitle) return entityTitle;
  return `${entityTitle} | ${headTitle}`;
};

const maybeAppendParentTitle = (entityTitle, parent) => {
  const { socialTitle, titlePlaintext } = parent?.attributes ?? {};
  const parentTitle = socialTitle ?? titlePlaintext;
  if (parentTitle) return `${entityTitle} | ${parentTitle}`;
  return entityTitle;
};

const TYPE_MAP = {
  journalVolumes: "glossary.volume_one",
  journalIssues: "glossary.issue_truncated_one"
};

const maybeSubstituteNumber = (titlePlaintext, number, type, t) => {
  const typeStr = TYPE_MAP[type];
  if (!number || !typeStr) return titlePlaintext;
  return `${t(typeStr)} ${number}`;
};

const maybeSocialTitle = (socialTitle, ...args) => {
  if (socialTitle) return socialTitle;
  return maybeSubstituteNumber(...args);
};

const maybePrepend = (entityTitle, prepend) => {
  if (!prepend) return entityTitle;
  return `${prepend} | ${entityTitle}`;
};

export const useMetaTitle = (entity, parent, prepend) => {
  const { t } = useTranslation();
  const settings = useFromStore({ requestKey: "settings", action: "select" });

  if (!entity?.attributes) return undefined;

  const headTitle = settings?.attributes.general.headTitle;

  const {
    socialTitle,
    titlePlaintext,
    title,
    name,
    number
  } = entity.attributes;
  const baseTitle = titlePlaintext ?? title ?? name;

  const entityTitle = maybePrepend(
    maybeSocialTitle(socialTitle, baseTitle, number, entity.type, t),
    prepend
  );

  return appendHeadTitle(
    maybeAppendParentTitle(entityTitle, parent),
    headTitle
  );
};

export const useMetaDescription = (entity, parent) => {
  const { socialDescription, descriptionPlaintext, description } =
    entity?.attributes ?? {};
  if (socialDescription) return socialDescription;
  if (descriptionPlaintext) return descriptionPlaintext;
  if (description) return description;

  const {
    socialDescription: parentSocialDescription,
    descriptionPlaintext: parentDescriptionPlaintext,
    description: parentDescription
  } = parent?.attributes ?? {};
  return (
    parentSocialDescription ?? parentDescriptionPlaintext ?? parentDescription
  );
};

const maybeCoverImage = (entity, fallback) => {
  if (entity.attributes.coverStyles)
    return entity.attributes.coverStyles.medium;
  return fallback;
};

const maybeAvatarImage = (entity, fallback) => {
  if (entity.attributes.avatarStyles)
    return entity.attributes.avatarStyles.medium;
  return fallback;
};

const maybeLogoImage = (entity, fallback) => {
  if (entity.attributes.logoStyles)
    return entity.attributes.logoStyles.mediumSquare;
  return fallback;
};

const maybeHeroImage = (entity, fallback) => {
  if (entity.attributes.heroStyles)
    return entity.attributes.heroStyles.mediumLandscape;
  return fallback;
};

const fallbackImageFor = (entity, parent) => {
  const type = entity?.type;
  switch (type) {
    case "projects":
      return maybeCoverImage(entity, maybeAvatarImage(entity));
    case "journals":
      return maybeLogoImage(entity, maybeAvatarImage(entity));
    case "projectCollections":
      return maybeHeroImage(entity);
    case "texts":
      return maybeCoverImage(entity, fallbackImageFor(parent));
    case "journalIssues":
      return maybeCoverImage(
        entity,
        maybeAvatarImage(entity, fallbackImageFor(parent))
      );
    case "journalVolumes":
    case "textSections":
      return fallbackImageFor(parent);
    default:
      return null;
  }
};

export const useMetaImage = (entity, parent) => {
  if (!entity?.attributes) return undefined;

  const { socialImageStyles } = entity.attributes;

  if (socialImageStyles?.mediumLandscape)
    return socialImageStyles.mediumLandscape;

  return fallbackImageFor(entity, parent);
};

const useEntityHeadContent = (entity, parent, titlePrepend) => {
  const title = useMetaTitle(entity, parent, titlePrepend);
  const description = useMetaDescription(entity, parent);
  const image = useMetaImage(entity, parent);

  return { title, description, image };
};

export default useEntityHeadContent;
