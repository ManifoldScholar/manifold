function projectParent(parents) {
  const project = parents?.project;
  if (!project?.id) return null;
  return { label: project.title, to: `/lti/projects/${project.id}` };
}

function pickStyle(styles, keys) {
  if (!styles) return null;
  const hit = keys.find(k => styles[k]);
  return hit ? styles[hit] : null;
}

const TEXT_COVER_VARIANTS = [
  "smallPortrait",
  "small",
  "mediumPortrait",
  "medium"
];

function thumb(url, alt, width, height) {
  return { url, alt, width: width ?? 80, height: height ?? 80 };
}

function resourceThumbnail(entity) {
  const attrs = entity?.attributes;
  if (!attrs) return thumb(null, null);
  const variant = attrs.variantThumbnailStyles?.small ?? null;
  const attachment = attrs.attachmentStyles?.small ?? null;
  if (attrs.kind === "image") {
    return thumb(attachment, attrs.attachmentAltText ?? null);
  }
  if (variant) {
    return thumb(variant, attrs.variantThumbnailAltText ?? null);
  }
  return thumb(attachment, attrs.attachmentAltText ?? null);
}

const MAP = {
  project: entity => {
    const attrs = entity.attributes;
    const variants = ["smallPortrait", "small"];
    const key = variants.find(v => attrs?.avatarStyles?.[v]) ?? null;
    const meta = key ? attrs?.avatarMeta?.[key] : null;
    return {
      to: `/lti/projects/${entity.id}`,
      parent: null,
      thumbnail: thumb(
        key ? attrs.avatarStyles[key] : null,
        attrs?.avatarAltText ?? null,
        meta?.width,
        meta?.height
      )
    };
  },
  text: (entity, parents) => ({
    to: `/lti/texts/${entity.id}`,
    parent: projectParent(parents),
    thumbnail: thumb(
      pickStyle(entity.attributes?.coverStyles, TEXT_COVER_VARIANTS),
      entity.attributes?.coverAltText ?? null
    )
  }),
  textSection: (entity, parents) => {
    const text = parents?.text;
    const thumbnail = thumb(
      pickStyle(entity.attributes?.coverStyles, TEXT_COVER_VARIANTS),
      entity.attributes?.coverAltText ?? null
    );
    if (!text?.slug) return { to: null, parent: null, thumbnail };
    return {
      parent: {
        label: text.title,
        to: `/lti/texts/${text.slug}`,
        creatorNames: text.attributes?.creatorNames
      },
      thumbnail
    };
  },
  resource: (entity, parents) => ({
    parent: projectParent(parents),
    thumbnail: resourceThumbnail(entity)
  }),
  resourceCollection: (entity, parents) => ({
    to: `/lti/resource-collections/${entity.id}`,
    parent: projectParent(parents),
    thumbnail: thumb(
      pickStyle(entity.attributes?.thumbnailStyles, [
        "smallLandscape",
        "mediumLandscape"
      ]),
      entity.attributes?.thumbnailAltText ?? null
    )
  })
};

export function buildResultProps(type, entity, parents) {
  const build = MAP[type];
  return build ? build(entity, parents) : null;
}
