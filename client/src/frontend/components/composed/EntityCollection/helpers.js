import isEmpty from "lodash/isEmpty";

export function getHeroImage(collection) {
  const { heroLayout, heroStyles } = collection.attributes;
  if (isEmpty(heroStyles)) return null;
  switch (heroLayout) {
    case "full_bleed":
    case "wide_inset":
      return heroStyles.largeLandscape;
    case "square_inset":
      return heroStyles.mediumSquare;
    default:
      return null;
  }
}

export function getHeaderLayout(collection) {
  const {
    heroLayout,
    heroStyles,
    descriptionFormatted: description
  } = collection.attributes;
  if (isEmpty(heroStyles))
    return description ? "title_description" : "title_only";
  return heroLayout;
}
