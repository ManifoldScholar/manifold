import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function Description({ date, description, className }) {
  const { t } = useTranslation();

  if (!date && !description) return null;

  return (
    <Styled.Wrapper className={className}>
      {!!date && (
        <Styled.DateWrapper>
          <FormattedDate
            prefix={t("dates.collection_created")}
            format="MMMM yyyy"
            date={date}
          />
        </Styled.DateWrapper>
      )}
      {!!description && (
        <div
          dangerouslySetInnerHTML={{
            __html: description
          }}
        />
      )}
    </Styled.Wrapper>
  );
}

Description.displayName = "Frontend.Components.ResourceCollection.Description";
