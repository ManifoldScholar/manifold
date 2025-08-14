import capitalize from "lodash/capitalize";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function ResourceListItem({ resource, active, setActive }) {
  const { title, variantThumbnailStyles, attachmentStyles, kind, createdAt } =
    resource?.attributes ?? {};

  const { t } = useTranslation();

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setActive(resource);
  };

  const src = variantThumbnailStyles?.medium ?? attachmentStyles?.medium;

  return resource ? (
    <Styled.Wrapper $active={active} onClick={handleClick}>
      <Styled.TextColumn>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Metadata>
          <Styled.Tag>
            <IconComposer icon={`resource${capitalize(kind)}64`} size={20} />
            <span>{kind}</span>
          </Styled.Tag>
          <Styled.Date>
            <span>{t("dates.created_title_case")}</span>
            <FormattedDate date={createdAt} />
          </Styled.Date>
        </Styled.Metadata>
      </Styled.TextColumn>
      <Styled.ImageWrapper>
        {src ? (
          <Styled.Thumb src={src} />
        ) : (
          <Styled.Icon icon={`resource${capitalize(kind)}64`} size={32} />
        )}
      </Styled.ImageWrapper>
    </Styled.Wrapper>
  ) : null;
}
