import orderBy from "lodash/orderBy";

export const getAuth = (entity, authorization) => {
  const showErrors = authorization.current.authorizeAbility({
    entity,
    ability: "update"
  });
  const authorized = authorization.current.authorizeAbility({
    entity,
    ability: "fullyRead"
  });
  return { showErrors, authorized };
};

export const getPartsData = entity => {
  const callouts = entity.relationships?.actionCallouts ?? [];
  const orderedCallouts = orderBy(
    callouts,
    ["attributes.button", "attributes.location", "attributes.position"],
    ["desc", "asc", "asc"]
  );
  const calloutsBySide = side =>
    orderBy(
      callouts.filter(callout => callout.attributes.location === side),
      ["attributes.button", "attributes.position"],
      ["desc", "asc"]
    );
  const leftCallouts = calloutsBySide("left");
  const rightCallouts = calloutsBySide("right");

  const copy = entity.attributes.imageCreditsFormatted;
  const bgImage =
    entity.attributes.heroStyles?.largeLandscape &&
    entity.attributes.heroStyles?.mediumLandscape
      ? entity.attributes.heroStyles
      : false;
  const bgAlt = entity.attributes.heroAltText;

  const twitter = entity.attributes.twitterId;
  const instagram = entity.attributes.instagramId;
  const facebook = entity.attributes.facebookId;
  const hashtag = entity.attributes.hashtag;
  const social = !!twitter || !!instagram || !!facebook || !!hashtag;

  const description = entity.attributes.descriptionFormatted;
  const { creators, contributors } = entity.relationships;
  const cover = entity.attributes.coverStyles?.medium;
  return {
    callouts,
    orderedCallouts,
    leftCallouts,
    rightCallouts,
    copy,
    bgImage,
    bgAlt,
    twitter,
    instagram,
    facebook,
    hashtag,
    social,
    description,
    creators,
    contributors,
    cover
  };
};
