import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function ResourceCollectionListItem({
  collection,
  active,
  setActive
}) {
  const { title, thumbnailStyles, createdAt } = collection?.attributes ?? {};

  const { t } = useTranslation();

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setActive(collection);
  };

  return collection ? (
    <Styled.Wrapper $active={active} onClick={handleClick}>
      <Styled.TextColumn>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Metadata>
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
  ) : null;
}
