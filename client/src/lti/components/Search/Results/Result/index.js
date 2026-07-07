import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import Badge from "lti/components/atomics/Badge";
import Button from "global/components/atomic/Button";
import Thumbnail from "./Thumbnail";
import { useSelection } from "lti/contexts";
import { buildResultProps } from "./helpers";
import { capitalize } from "lodash";
import * as Styled from "./styles";

const BUTTON_STYLE_PROPS = {
  size: "xSm",
  shape: "lozenge",
  lowercase: true
};

const ACCEPTED_TYPES = [
  "project",
  "text",
  "textSection",
  "resource",
  "resourceCollection"
];

export default function Result({ entity, type, parents }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { add, remove, has } = useSelection();

  if (!entity || !ACCEPTED_TYPES.includes(type)) {
    return null;
  }

  const linkState = { search: location.search };

  const { attributes } = entity ?? {};
  const {
    titlePlaintext,
    title: collectionTitle,
    name,
    subtitlePlaintext,
    creatorNames,
    avatarColor,
    kind
  } = attributes;

  const { to, parent, thumbnail } =
    buildResultProps(type, entity, parents) ?? {};

  const title = titlePlaintext ?? name ?? collectionTitle;
  const selectionTitle =
    type === "textSection" && parent?.label
      ? `${parent.label} — ${title}`
      : title;
  const item = { type, id: entity.id, title: selectionTitle };
  const selected = has(item);

  const linkable = to && to !== location.pathname;
  const linkProps = linkable ? { to, state: linkState } : {};

  return (
    <Styled.Box>
      <Thumbnail
        type={type}
        thumbnail={thumbnail}
        avatarColor={avatarColor}
        resourceKind={kind}
      />
      <Styled.TextContent>
        <Badge type={type} resourceKind={kind} />
        <Styled.TitleGroup>
          {parent ? (
            <Styled.Parent>
              {parent.to ? (
                <Link to={parent.to}>{parent.label}</Link>
              ) : (
                parent.label
              )}
            </Styled.Parent>
          ) : null}
          <Styled.Title as={!linkable ? "span" : undefined} {...linkProps}>
            {title}
          </Styled.Title>
        </Styled.TitleGroup>
        {subtitlePlaintext ? (
          <Styled.Subtitle>{subtitlePlaintext}</Styled.Subtitle>
        ) : null}
        {creatorNames ? (
          <Styled.Byline>
            <span>{capitalize(t("common.by"))}</span>
            {creatorNames ?? parent.creatorNames}
          </Styled.Byline>
        ) : null}
      </Styled.TextContent>
      <Styled.Actions>
        <Button
          label={t(selected ? "lti.toggle.linked" : "lti.toggle.link")}
          preIcon={selected ? "checkmark16" : "plusCircle16"}
          background={selected ? "accent" : "neutral"}
          onClick={() => (selected ? remove(item) : add(item))}
          aria-pressed={selected}
          {...BUTTON_STYLE_PROPS}
        />
        {linkable && (
          <Button
            as={Link}
            label={t("lti.actions.view_contents")}
            postIcon="arrowRight16"
            background="outline"
            {...linkProps}
            {...BUTTON_STYLE_PROPS}
          />
        )}
      </Styled.Actions>
    </Styled.Box>
  );
}
