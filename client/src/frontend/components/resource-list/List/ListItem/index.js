import capitalize from "lodash/capitalize";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import Badge from "frontend/components/resource/Badge";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function ResourceListItem({
  resource,
  resourceCollection,
  project,
  active,
  setActive,
  renderAsLink = false,
  headingLevel = 3
}) {
  const { title, variantThumbnailStyles, attachmentStyles, kind, createdAt } =
    resource?.attributes ?? {};

  const { t } = useTranslation();

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setActive(resource);
  };

  const src = variantThumbnailStyles?.small ?? attachmentStyles?.small;

  return resource ? (
    <li>
      <Styled.Wrapper $active={active}>
        <Styled.TextColumn>
          {renderAsLink ? (
            <Styled.Link
              to={
                resourceCollection
                  ? lh.link(
                      "frontendProjectCollectionResource",
                      resource.attributes.projectSlug,
                      resourceCollection.attributes.slug,
                      resource.attributes.slug
                    )
                  : lh.link(
                      "frontendProjectResource",
                      project.attributes.slug,
                      resource.attributes.slug
                    )
              }
            >
              <Styled.Title as={`h${headingLevel}`}>{title}</Styled.Title>
            </Styled.Link>
          ) : (
            <Styled.Button onClick={handleClick}>
              <Styled.Title as={`h${headingLevel}`}>{title}</Styled.Title>
            </Styled.Button>
          )}
          <Styled.Metadata>
            <Badge kind={resource.attributes.kind} showKindOnly />
            <Styled.Date>
              <span>{t("dates.created_title_case")}</span>
              <FormattedDate date={createdAt} />
            </Styled.Date>
          </Styled.Metadata>
        </Styled.TextColumn>
        <Styled.ImageWrapper>
          {src ? (
            <Styled.Thumb src={src} loading="lazy" width={100} height={64} />
          ) : (
            <Styled.Icon icon={`resource${capitalize(kind)}64`} size={32} />
          )}
        </Styled.ImageWrapper>
      </Styled.Wrapper>
    </li>
  ) : null;
}
