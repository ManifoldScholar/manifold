export function getHeroImage(layout, collection) {
  const { heroStyles } = collection?.attributes ?? {};
  switch (layout) {
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
  const { heroLayout, heroStyles, descriptionFormatted: description } =
    collection?.attributes ?? {};
  if (heroLayout && heroStyles) return heroLayout;
  if (heroStyles?.largeLandscape) return "square_inset";
  return description ? "title_description" : "title_only";
}
