import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import Badge from "frontend/components/resource/Badge/Collection";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function ResourceCollectionListItem({
  collection,
  project,
  active,
  setActive,
  renderAsLink = false,
  headingLevel = 3
}) {
  const { title, thumbnailStyles, createdAt, collectionResourcesCount } =
    collection?.attributes ?? {};

  const { t } = useTranslation();

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setActive(collection);
  };

  return collection ? (
    <li>
      <Styled.Wrapper $active={active}>
        <Styled.TextColumn>
          {renderAsLink ? (
            <Styled.Link
              to={lh.link(
                "frontendProjectResourceCollection",
                project.attributes.slug,
                collection.attributes.slug
              )}
            >
              <Styled.Title as={`h${headingLevel}`}>{title}</Styled.Title>
            </Styled.Link>
          ) : (
            <Styled.Button onClick={handleClick}>
              <Styled.Title as={`h${headingLevel}`}>{title}</Styled.Title>
            </Styled.Button>
          )}
          <Styled.Metadata>
            <Badge resourceCount={collectionResourcesCount} showCountOnly />
            <Styled.Date>
              <span>{t("dates.created_title_case")}</span>
              <FormattedDate date={createdAt} />
            </Styled.Date>
          </Styled.Metadata>
        </Styled.TextColumn>
        <Styled.ImageWrapper>
          {thumbnailStyles?.medium ? (
            <Styled.Thumb src={thumbnailStyles?.medium} />
          ) : (
            <Styled.Icon icon={`resourceCollection64`} size={32} />
          )}
        </Styled.ImageWrapper>
      </Styled.Wrapper>
    </li>
  ) : null;
}
