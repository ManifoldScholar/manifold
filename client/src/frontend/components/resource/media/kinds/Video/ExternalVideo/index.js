import * as Styled from "./styles";

// strip out addtl params from ID (e.g. `Zo6UnKr6Bwg&t=21s`),
// which can be mistakenly included and cause embeds to fail
function getParsedId(externalId) {
  const url = new URL(`http://manifold.lvh/?id=${externalId}`);
  const params = new URLSearchParams(url.search);
  return params.get("id");
}

function getSrc(resource) {
  const { externalType, externalId } = resource.attributes;
  const parsedId = getParsedId(externalId);

  switch (externalType) {
    case "vimeo":
      return `//player.vimeo.com/video/${parsedId}`;
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${parsedId}?rel=0`;
    default:
      return null;
  }
}

export default function ExternalVideo({ resource }) {
  const src = getSrc(resource);

  if (!src) return null;

  const { title, externalType } = resource.attributes;

  return (
    <Styled.Iframe
      src={src}
      title={title}
      allowFullScreen
      type={externalType === "youtube" ? "text/html" : undefined}
      loading="lazy"
      width={560}
      height={315}
    />
  );
}
