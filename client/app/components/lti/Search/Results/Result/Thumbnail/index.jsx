import IconComposer from "components/global/utility/IconComposer";
import IconComputed from "components/global/icon-computed";
import UniqueIcons from "components/global/icon/unique";
import * as Styled from "./styles";

const ICONS = {
  project: "projects64",
  text: "textsBook64",
  textSection: "toc64",
  resourceCollection: "resourceCollection64"
};

export default function LtiThumbnail({
  type,
  thumbnail,
  avatarColor,
  resourceKind
}) {
  const { url, alt, width, height } = thumbnail ?? {};

  if (url) {
    return (
      <Styled.Image>
        <img
          src={url}
          alt={alt ?? ""}
          width={width}
          height={height}
          loading="lazy"
        />
      </Styled.Image>
    );
  }

  if (type === "project" && avatarColor) {
    return (
      <Styled.Avatar className="avatar">
        <UniqueIcons.ProjectPlaceholderUnique
          className="project-thumb-placeholder"
          color={avatarColor}
        />
      </Styled.Avatar>
    );
  }

  if (type === "resource") {
    return (
      <Styled.Icon>
        <IconComputed.Resource icon={resourceKind} size={36} />
      </Styled.Icon>
    );
  }

  const icon = ICONS[type];
  if (!icon) return null;
  return (
    <Styled.Icon>
      <IconComposer icon={icon} size={36} />
    </Styled.Icon>
  );
}
